#!/bin/bash
# musicmakesdest is user@host:path
rsync -avz --exclude up.sh --exclude .git --exclude .sass-cache --exclude '*.sw?' . $musicmakesdest
