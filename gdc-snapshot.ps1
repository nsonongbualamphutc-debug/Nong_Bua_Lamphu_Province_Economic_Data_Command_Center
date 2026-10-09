<#
  สำเนาข้อมูล API ระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู → data/gdc-snapshot.json บน GitHub
  ใช้บนคอมพิวเตอร์ในสำนักงาน (เครือข่ายในประเทศ) เพื่อให้ iPad / มือถือ / อุปกรณ์ที่เข้า API ไม่ได้ เห็นข้อมูลล่าสุด
  - อ่านรายการชุดข้อมูลจาก ds.js บนเว็บ (ไม่ต้องแก้สคริปต์เมื่อเพิ่มชุดข้อมูล)
  - ส่งขึ้น GitHub เฉพาะเมื่อข้อมูลเปลี่ยน หรือสำเนาเดิมเก่ากว่า 24 ชั่วโมง
  - โทเคน GitHub อ่านจากไฟล์ gdc-token.txt ข้างสคริปต์ (ห้ามอัปโหลดไฟล์นี้ขึ้น GitHub)
#>
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$Here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Base   = 'https://nongbualamphu.gdcatalog.go.th'
$Owner  = 'nsonongbualamphutc-debug'
$Repo   = 'Nong_Bua_Lamphu_Province_Economic_Data_Command_Center'
$Branch = 'Patch-1.2'
$GhPath = 'data/gdc-snapshot.json'
$Site   = "https://$Owner.github.io/$Repo"
$Log    = Join-Path $Here 'gdc-snapshot.log'

function Log($m) { $l = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m"; Write-Host $l; Add-Content -Path $Log -Value $l -Encoding UTF8 }
function GetText($url) {
  $wc = New-Object Net.WebClient; $wc.Encoding = [Text.Encoding]::UTF8
  $wc.Headers.Add('User-Agent', 'NBL-Dashboard-Snapshot/1.0'); $wc.Headers.Add('Cache-Control', 'no-cache')
  return $wc.DownloadString($url)
}
function Api($action, $query) {
  $r = (GetText "$Base/api/3/action/$action`?$query") | ConvertFrom-Json
  if (-not $r.success) { throw "$action ไม่สำเร็จ" }
  return $r.result
}

try {
  # 1) รายการชุดข้อมูลจาก ds.js
  $ds  = GetText "$Site/ds.js?t=$([DateTime]::UtcNow.Ticks)"
  $ids = [regex]::Matches($ds, "'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'") | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  if (-not $ids) { throw 'ไม่พบรายการชุดข้อมูลใน ds.js' }

  # 2) ตรวจว่าเครื่องนี้เข้า API ได้
  try { $null = Api 'site_read' '' } catch { throw "เครื่องนี้เข้าระบบบัญชีข้อมูลจังหวัดไม่ได้ ($($_.Exception.Message))" }

  $res = [ordered]@{}; $meta = [ordered]@{}; $miss = @()
  foreach ($id in $ids) {
    try {
      $off = 0; $rec = New-Object System.Collections.ArrayList; $fields = $null; $total = 0
      do {
        $r = Api 'datastore_search' "resource_id=$id&limit=1000&offset=$off"
        if (-not $fields) { $fields = @($r.fields | Where-Object { $_.id -ne '_id' } | ForEach-Object { [ordered]@{ id = $_.id; type = $_.type } }) }
        $total = [int]$r.total
        foreach ($x in $r.records) { $x.PSObject.Properties.Remove('_id'); [void]$rec.Add($x) }
        $off += 1000
      } while ($rec.Count -lt $total -and $off -lt 20000)
      $m = $null
      try {
        $rs = Api 'resource_show' "id=$id"
        $pk = $null; try { $pk = Api 'package_show' "id=$($rs.package_id)" } catch {}
        $m = if ($rs.last_modified) { $rs.last_modified } elseif ($rs.metadata_modified) { $rs.metadata_modified } else { $rs.created }
        $meta[$id] = [ordered]@{
          id = $id; name = $rs.name; modified = $m; created = $rs.created; format = $rs.format
          pkg = $(if ($pk) { $pk.name } else { $rs.package_id }); pkgTitle = $(if ($pk) { $pk.title } else { '' })
          org = $(if ($pk -and $pk.organization) { $pk.organization.title } else { '' })
          pkgModified = $(if ($pk) { $pk.metadata_modified } else { $null })
          url = "$Base/dataset/$(if ($pk) { $pk.name } else { $rs.package_id })/resource/$id"
        }
      } catch {}
      $o = [ordered]@{ fields = $fields; total = $total; records = $rec.ToArray() }
      if ($m) { $o.m = $m }
      $res[$id] = $o
    } catch { $miss += $id }
  }
  if ($res.Count -eq 0) { throw 'ดึงข้อมูลไม่ได้เลย' }

  # 3) ลายเซ็น (คำนวณแบบเดียวกับแดชบอร์ด) และเทียบกับสำเนาเดิม
  $keys = @($res.Keys) | Sort-Object
  $sig  = ($keys | ForEach-Object { "$($_):$($res[$_].total):$(if ($res[$_].m) { $res[$_].m } else { '' })" }) -join '|'
  $sorted = [ordered]@{}; foreach ($k in $keys) { $sorted[$k] = $res[$k] }
  $now  = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
  $snap = [ordered]@{ v = 1; at = $now; by = 'script'; sig = $sig; n = $res.Count; miss = @($miss); res = $sorted; meta = $meta }
  $json = ConvertTo-Json -InputObject $snap -Depth 12 -Compress
  [IO.File]::WriteAllText((Join-Path $Here 'gdc-snapshot.json'), $json, (New-Object Text.UTF8Encoding $false))

  $old = ''; try { $old = GetText "https://raw.githubusercontent.com/$Owner/$Repo/$Branch/$($GhPath)?t=$([DateTime]::UtcNow.Ticks)" } catch {}
  $oldSig = ([regex]::Match($old, '"sig":"((?:[^"\\]|\\.)*)"')).Groups[1].Value
  $oldAt  = ([regex]::Match($old, '"at":"([^"]+)"')).Groups[1].Value
  $fresh  = $false; if ($oldAt) { $fresh = ((Get-Date) - [DateTime]::Parse($oldAt)).TotalHours -lt 24 }
  if ($oldSig -eq $sig -and $fresh) { Log "ข้อมูลไม่เปลี่ยน ($($res.Count) ชุด) · ไม่ต้องส่ง"; exit 0 }

  # 4) ส่งขึ้น GitHub
  $tokFile = Join-Path $Here 'gdc-token.txt'
  if (-not (Test-Path $tokFile)) { Log "สร้างสำเนาแล้ว ($($res.Count) ชุด) แต่ไม่พบ gdc-token.txt · อัปโหลด gdc-snapshot.json ไปที่ data/ เอง"; exit 2 }
  $tok = (Get-Content $tokFile -Raw).Trim()
  $H = @{ Authorization = "Bearer $tok"; 'User-Agent' = 'NBL-Dashboard-Snapshot'; Accept = 'application/vnd.github+json' }
  $u = "https://api.github.com/repos/$Owner/$Repo/contents/$GhPath"
  $sha = $null; try { $sha = (Invoke-RestMethod -Uri "$u`?ref=$Branch" -Headers $H).sha } catch {}
  $body = [ordered]@{ message = "Update API snapshot $now"; content = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)); branch = $Branch }
  if ($sha) { $body.sha = $sha }
  $null = Invoke-RestMethod -Method Put -Uri $u -Headers $H -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $body -Compress)))
  Log "ส่งสำเนาใหม่แล้ว $($res.Count) ชุด$(if ($miss.Count) { " · ข้าม $($miss.Count) รหัสที่ไม่ใช่ตารางข้อมูล" })"
  exit 0
} catch {
  Log "ผิดพลาด: $($_.Exception.Message)"; exit 1
}
