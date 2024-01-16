# Stats GeoGuessr duels

This repo purpose is to have a save of the main code of the project.  
The objective of this Python + Google Sheets project is to provide an open source template for everyone eager to get some stats on their ranked duels.  
There are 2 main parts: Python code in a Google Colab and a Google Sheets for stats computation and display.

## The Python

The Python code is run on a Google Colab. The code is available in this repo but only one version of it (english, single player) is [here](https://colab.research.google.com/drive/1EZRXe12tddKED87EGRuOS9KvWWfQRQdw#scrollTo=-cyrdcgAaeN7).  
Its use is to get the history of a player (logged in via their NCFA Cookie), get their ranked duels and extract some duels infos.  
It then writes it in the Google Sheet copy of the player in `Data_duel_player-nickname`.

## The Google Sheets

The Google Sheets computes some stats on duels from the fetched data. Each player has their own copy. An example (english, single player) is available [here](https://docs.google.com/spreadsheets/d/1SSKhHFIQXc4DQkdYxaSuepbpWTFg_i4py01cBnUMxW8/edit#gid=1352884186).  
The project initialisation is explained in the README sheet. More details can be found in the Changelog sheet (copied in this repo without formatting).  
Players mainly use the `Display_stats` to see a display of their stats.

### The Apps Scripts
Some of the functions of the Google Sheets run thank to Apps Scripts. A copy of ths functions is available in this repo as a JS file.[changelog.txt](https://github.com/xi4774/Geoguessr-Duel-stats/files/13943936/changelog.txt)
