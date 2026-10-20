#!/bin/bash
# Quick QA before a full render: stills at each piece (+25 frames) -> out/<slug>-sheet.png
s=$1; node render.mjs $s --dry >/dev/null || exit 1
P=.cache/$s.props.json; frames=$(node -e "const p=require('./$P');console.log(p.pieces.map(x=>x.start+25).join(' '))")
i=0; files=(); for fr in $frames; do ./node_modules/.bin/remotion still src/index.ts HiddenCleanShort out/$s-$i.png --frame=$fr --props=$P --browser-executable=/usr/bin/google-chrome-stable --gl=angle >/dev/null 2>&1 || echo "still $fr failed"; files+=(-i out/$s-$i.png); i=$((i+1)); done
ffmpeg -v error -y "${files[@]}" -filter_complex "hstack=$i,scale=$((i*300)):-1" out/$s-sheet.png && rm -f out/$s-?.png && echo out/$s-sheet.png
