<#
  สำเนาข้อมูล API ระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู → data/gdc/ บน GitHub (สาขาที่ GitHub Pages ใช้)
  ใช้บนคอมพิวเตอร์ในสำนักงาน (เครือข่ายในประเทศ) เพื่อให้ iPad / มือถือ / อุปกรณ์ที่เข้า API ไม่ได้ เห็นข้อมูลล่าสุด
  - อ่านรายการชุดข้อมูลจาก ds.js บนเว็บ (เพิ่มชุดข้อมูลในแดชบอร์ดแล้วไม่ต้องแก้สคริปต์)
  - ส่งเฉพาะชุดที่หน่วยงานปรับปรุง (จำนวนแถว/วันที่ปรับปรุงเปลี่ยน) ในคอมมิตเดียว · ไม่มีอะไรเปลี่ยนแต่เกิน 24 ชม. → ส่ง index ใหม่
  - โทเคน GitHub อ่านจาก gdc-token.txt ข้างสคริปต์ (ห้ามอัปโหลดไฟล์นี้ขึ้น GitHub)
#>
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Web
$Here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Base   = 'https://nongbualamphu.gdcatalog.go.th'
$Owner  = 'nsonongbualamphutc-debug'
$Repo   = 'Nong_Bua_Lamphu_Province_Economic_Data_Command_Center'
$Branch = 'Patch-1.2'
$Dir    = 'data/gdc/'
$Site   = "https://$Owner.github.io/$Repo"
$Log    = Join-Path $Here 'gdc-snapshot.log'
$Inv    = [Globalization.CultureInfo]::InvariantCulture

function Log($m) { $l = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m"; Write-Host $l; Add-Content -Path $Log -Value $l -Encoding UTF8 }
function GetText($url) {
  $wc = New-Object Net.WebClient; $wc.Encoding = [Text.Encoding]::UTF8
  $wc.Headers.Add('User-Agent', 'NBL-Dashboard-Snapshot/2.0'); $wc.Headers.Add('Cache-Control', 'no-cache')
  return $wc.DownloadString($url)
}
function Api($action, $query) {
  $r = (GetText "$Base/api/3/action/$action`?$query") | ConvertFrom-Json
  if (-not $r.success) { throw "$action ไม่สำเร็จ" }
  return $r.result
}
function J($v) {
  if ($null -eq $v) { return 'null' }
  if ($v -is [bool]) { if ($v) { return 'true' } else { return 'false' } }
  if ($v -is [int] -or $v -is [long] -or $v -is [double] -or $v -is [decimal] -or $v -is [single]) { return $v.ToString($Inv) }
  return '"' + [System.Web.HttpUtility]::JavaScriptStringEncode([string]$v) + '"'
}

try {
  # 1) รายการชุดข้อมูลจาก ds.js
  $ds  = GetText "$Site/ds.js?t=$([DateTime]::UtcNow.Ticks)"
  $ds  = ($ds -split "`n" | Where-Object { $_ -notmatch "state:'avail'" }) -join "`n"   # ข้ามชุดที่แค่ลงทะเบียนไว้
  $ids = [regex]::Matches($ds, "'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'") | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  if (-not $ids) { throw 'ไม่พบรายการชุดข้อมูลใน ds.js' }

  # 2) ตรวจว่าเครื่องนี้เข้า API ได้
  try { $null = Api 'site_read' '' } catch { throw "เครื่องนี้เข้าระบบบัญชีข้อมูลจังหวัดไม่ได้ ($($_.Exception.Message))" }

  $res = @{}; $meta = @{}; $files = @{}; $miss = @()
  foreach ($id in $ids) {
    try {
      $off = 0; $rows = New-Object System.Text.StringBuilder; $cols = $null; $fj = $null; $total = 0; $cnt = 0
      do {
        $r = Api 'datastore_search' "resource_id=$id&limit=1000&offset=$off"
        if (-not $cols) {
          $f = @($r.fields | Where-Object { $_.id -ne '_id' })
          $cols = @($f | ForEach-Object { $_.id })
          $fj = '[' + (($f | ForEach-Object { '{"id":' + (J $_.id) + ',"type":' + (J $_.type) + '}' }) -join ',') + ']'
        }
        $total = [int]$r.total
        foreach ($x in $r.records) {
          if ($cnt -gt 0) { [void]$rows.Append(',') }
          [void]$rows.Append('[' + (($cols | ForEach-Object { J $x.$_ }) -join ',') + ']'); $cnt++
        }
        $off += 1000
      } while ($cnt -lt $total -and $off -lt 200000)
      $files["$Dir$id.json"] = '{"id":' + (J $id) + ',"fields":' + $fj + ',"rows":[' + $rows.ToString() + ']}'
      $o = [ordered]@{ total = $total }
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
        if ($m) { $o.m = $m }
      } catch {}
      $res[$id] = $o
    } catch { $miss += $id }
  }
  if ($res.Count -eq 0) { throw 'ดึงข้อมูลไม่ได้เลย' }

  # 3) index + ลายเซ็น (แบบเดียวกับแดชบอร์ด)
  $keys = @($res.Keys) | Sort-Object
  $key  = { param($x) "$($x.total):$(if ($x.m) { $x.m } else { '' })" }
  $sig  = ($keys | ForEach-Object { "$($_):$(& $key $res[$_])" }) -join '|'
  $R = [ordered]@{}; foreach ($k in $keys) { $R[$k] = $res[$k] }
  $M = [ordered]@{}; foreach ($k in (@($meta.Keys) | Sort-Object)) { $M[$k] = $meta[$k] }
  $now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
  $index = [ordered]@{ v = 2; at = $now; by = 'script'; sig = $sig; n = $res.Count; miss = @($miss | Sort-Object); res = $R; meta = $M }
  $files["${Dir}index.json"] = ConvertTo-Json -InputObject $index -Depth 6 -Compress

  # เก็บสำเนาในเครื่องด้วย
  $out = Join-Path $Here 'gdc'; New-Item -ItemType Directory -Force -Path $out | Out-Null
  foreach ($p in $files.Keys) { [IO.File]::WriteAllText((Join-Path $out (Split-Path $p -Leaf)), $files[$p], (New-Object Text.UTF8Encoding $false)) }

  # 4) เทียบกับ index บนเว็บ → หาชุดที่เปลี่ยน
  $cur = $null; try { $cur = (GetText "https://raw.githubusercontent.com/$Owner/$Repo/$Branch/${Dir}index.json?t=$([DateTime]::UtcNow.Ticks)") | ConvertFrom-Json } catch {}
  $changed = @($keys | Where-Object { -not $cur -or -not $cur.res.$_ -or (& $key $cur.res.$_) -ne (& $key $res[$_]) })
  $fresh = $false; if ($cur -and $cur.at) { $fresh = ((Get-Date) - [DateTime]::Parse($cur.at)).TotalHours -lt 24 }
  if ($changed.Count -eq 0 -and $fresh) { Log "ข้อมูลไม่เปลี่ยน ($($res.Count) ชุด) · ไม่ต้องส่ง"; exit 0 }

  # 5) ส่งขึ้น GitHub ในคอมมิตเดียว
  $tokFile = Join-Path $Here 'gdc-token.txt'
  if (-not (Test-Path $tokFile)) { Log "สร้างสำเนาแล้ว ($($res.Count) ชุด) ในโฟลเดอร์ gdc แต่ไม่พบ gdc-token.txt · อัปโหลดไปที่ data/gdc/ เอง"; exit 2 }
  $tok = (Get-Content $tokFile -Raw).Trim()
  $H = @{ Authorization = "Bearer $tok"; 'User-Agent' = 'NBL-Dashboard-Snapshot'; Accept = 'application/vnd.github+json' }
  $A = "https://api.github.com/repos/$Owner/$Repo"
  function GH($method, $path, $body) {
    $p = @{ Method = $method; Uri = "$A$path"; Headers = $H; ContentType = 'application/json; charset=utf-8' }
    if ($body) { $p.Body = [Text.Encoding]::UTF8.GetBytes($body) }
    return Invoke-RestMethod @p
  }
  $send = @($changed | ForEach-Object { "$Dir$_.json" }) + @("${Dir}index.json")
  $ref  = GH 'GET' "/git/ref/heads/$Branch" $null
  $bc   = GH 'GET' "/git/commits/$($ref.object.sha)" $null
  $tree = @()
  foreach ($p in $send) {
    $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($files[$p]))
    $b = GH 'POST' '/git/blobs' ('{"content":"' + $b64 + '","encoding":"base64"}')
    $tree += [ordered]@{ path = $p; mode = '100644'; type = 'blob'; sha = $b.sha }
  }
  $t = GH 'POST' '/git/trees' (ConvertTo-Json -InputObject ([ordered]@{ base_tree = $bc.tree.sha; tree = @($tree) }) -Depth 4 -Compress)
  $c = GH 'POST' '/git/commits' (ConvertTo-Json -InputObject ([ordered]@{ message = "Update API snapshot $now ($($changed.Count) datasets)"; tree = $t.sha; parents = @($ref.object.sha) }) -Compress)
  $null = GH 'PATCH' "/git/refs/heads/$Branch" (ConvertTo-Json -InputObject @{ sha = $c.sha } -Compress)
  Log "ส่งสำเนาใหม่แล้ว · เปลี่ยน $($changed.Count) ชุด จากทั้งหมด $($res.Count) ชุด"
  exit 0
} catch {
  Log "ผิดพลาด: $($_.Exception.Message)"; exit 1
}
