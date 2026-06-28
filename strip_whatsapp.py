import re

file_path = "backend/app/api/v1/endpoints/whatsapp.py"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add the import statement near the top
import_statement = "import app.domain.services.whatsapp_service as ws_service\nfrom app.domain.services.whatsapp_service import send_text, send_template, download_media\n"
content = content.replace("from app.domain.services.ask_election_service import ask_election_question\n", "from app.domain.services.ask_election_service import ask_election_question\n" + import_statement)

# 2. Replace global variable usages with ws_service prefixes
content = content.replace("global _simulated_replies, _sim_media_bytes", "")
content = content.replace("_simulated_replies = []", "ws_service._simulated_replies = []")
content = content.replace("_sim_media_bytes = None", "ws_service._sim_media_bytes = None")
content = content.replace("_sim_media_bytes =", "ws_service._sim_media_bytes =")
content = content.replace("replies = list(_simulated_replies)", "replies = list(ws_service._simulated_replies)")

# 3. Remove the redefined functions and global blocks
# We'll just remove the blocks by using regex or split
parts = content.split("# ---------------------------------------------------------------------------")

# parts[0]: imports
# parts[1]: REGISTRATION HELPERS
# parts[2]: SENDING MESSAGES (remove)
# parts[3]: FASTAPI ENDPOINTS (keep)
# parts[4]: RECEIVING REPLIES (keep)
# parts[5]: MEDIA DOWNLOAD HELPER (remove)
# parts[6]: WEBHOOK MESSAGE HANDLER (keep)

new_parts = [
    parts[0], 
    "# ---------------------------------------------------------------------------\n# FASTAPI ENDPOINTS\n# ---------------------------------------------------------------------------" + parts[3].split("# FASTAPI ENDPOINTS\n# ---------------------------------------------------------------------------")[1],
    "# ---------------------------------------------------------------------------\n# RECEIVING REPLIES (the \"stretch goal\" / two-way piece)\n# ---------------------------------------------------------------------------" + parts[4].split("# RECEIVING REPLIES (the \"stretch goal\" / two-way piece)\n# ---------------------------------------------------------------------------")[1],
    "# ---------------------------------------------------------------------------\n# WEBHOOK MESSAGE HANDLER\n# ---------------------------------------------------------------------------" + parts[6].split("# WEBHOOK MESSAGE HANDLER\n# ---------------------------------------------------------------------------")[1]
]

with open(file_path, "w") as f:
    f.write("".join(new_parts))

print("Stripped successfully!")
