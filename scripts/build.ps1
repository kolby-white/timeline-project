# Converts data/timeline.csv (Google Sheets TimelineJS template columns)
# into data/timeline.json (TimelineJS JSON format) for index.html.
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/build.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$rows = Import-Csv -Path (Join-Path $root 'data/timeline.csv') -Encoding UTF8

function DateObj($y, $m, $d, $t, $display) {
  if (-not $y) { return $null }
  $o = [ordered]@{ year = $y }
  if ($m) { $o.month = $m }
  if ($d) { $o.day = $d }
  if ($t) { $o.time = $t }
  if ($display) { $o.display_date = $display }
  return $o
}

function Slug($text) {
  $s = ($text.ToLower() -replace "[^a-z0-9]+", '-').Trim('-')
  return "slide-$s"
}

function Slide($r) {
  $s = [ordered]@{}
  # Stable id so index.html can attach era labels and contrast styling to each slide.
  $s.unique_id = Slug $r.Headline
  $sd = DateObj $r.Year $r.Month $r.Day $r.Time $null
  if ($sd) { $s.start_date = $sd }
  $ed = DateObj $r.'End Year' $r.'End Month' $r.'End Day' $r.'End Time' $null
  if ($ed) { $s.end_date = $ed }
  if ($r.'Display Date') { $s.display_date = $r.'Display Date' }
  $s.text = [ordered]@{ headline = $r.Headline; text = $r.Text }
  if ($r.Media) {
    $m = [ordered]@{ url = $r.Media }
    if ($r.'Media Credit')    { $m.credit = $r.'Media Credit' }
    if ($r.'Media Caption')   { $m.caption = $r.'Media Caption' }
    if ($r.'Media Thumbnail') { $m.thumbnail = $r.'Media Thumbnail' }
    if ($r.'Alt Text')        { $m.alt = $r.'Alt Text' }
    $s.media = $m
  }
  if ($r.Group) { $s.group = $r.Group }
  if ($r.Background) {
    if ($r.Background -match '^#') { $s.background = @{ color = $r.Background } }
    else { $s.background = @{ url = $r.Background } }
  }
  return $s
}

$tl = [ordered]@{ events = @(); eras = @() }
foreach ($r in $rows) {
  switch ($r.Type) {
    'title' { $tl.title = Slide $r }
    'era'   { $tl.eras += [ordered]@{
                start_date = DateObj $r.Year $r.Month $r.Day $r.Time $null
                end_date   = DateObj $r.'End Year' $r.'End Month' $r.'End Day' $r.'End Time' $null
                text       = [ordered]@{ headline = $r.Headline; text = $r.Text } }
              # TimelineJS shows eras only as bands on the time bar. Also add each era as a
              # chapter-divider slide at the start of its period (same title, dates, and text).
              # It is listed before that year's entries so it sorts first.
              $ch = Slide $r
              $ch.unique_id = 'chapter-' + ($ch.unique_id -replace '^slide-', '')
              $ch.Remove('end_date')
              $ch.text.text = "<p>$($r.Text)</p>"
              $tl.events += $ch }
    default { $tl.events += Slide $r }
  }
}

$json = $tl | ConvertTo-Json -Depth 10
[IO.File]::WriteAllText((Join-Path $root 'data/timeline.json'), $json, (New-Object Text.UTF8Encoding $false))
$chapterCount = @($tl.events | ? { $_.unique_id -like "chapter-*" }).Count
"Built data/timeline.json: $($tl.events.Count - $chapterCount) entries, $chapterCount chapter dividers, $($tl.eras.Count) eras, title: $([bool]$tl.title)"
