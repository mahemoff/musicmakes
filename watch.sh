#!/bin/bash
sass --watch style:style -r ./lib/bourbon/lib/bourbon.rb &
coffee --watch --compile script/*.coffee &
