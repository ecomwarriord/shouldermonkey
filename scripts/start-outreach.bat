@echo off
cd /d "C:\Users\derol\Documents\Claude\Code Projects\shouldermonkey"
python scripts/outreach_engine.py daily >> logs\outreach.log 2>&1
