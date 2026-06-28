import re

file_path = "backend/app/api/v1/endpoints/whatsapp.py"
with open(file_path, "r") as f:
    lines = f.readlines()

new_lines = []
skip = False

for i, line in enumerate(lines):
    # Skip Registration Helpers block (lines 71-118 approx)
    if "# REGISTRATION HELPERS" in line:
        skip = True
    if skip and "# SENDING MESSAGES" in line:
        skip = False

    # Skip Sending Messages block
    if "# SENDING MESSAGES" in line:
        skip = True
    if skip and "# FASTAPI ENDPOINTS" in line:
        skip = False

    # Skip Media Download block
    if "# MEDIA DOWNLOAD HELPER" in line:
        skip = True
    if skip and "# WEBHOOK MESSAGE HANDLER" in line:
        skip = False

    # Skip Simulation state globals
    if "_simulated_replies: list[str] = []" in line or "_sim_media_bytes: bytes" in line or "_IS_SIMULATION = " in line:
        continue
    if "# Simulation mode: when token is dummy" in line:
        continue

    if not skip:
        # Inject import after ask_election_service
        if "from app.domain.services.ask_election_service import ask_election_question" in line:
            new_lines.append(line)
            new_lines.append("import app.domain.services.whatsapp_service as ws_service\n")
            new_lines.append("from app.domain.services.whatsapp_service import send_text, send_template, download_media\n")
            continue
            
        # Replace global variables inside functions
        if "global _simulated_replies, _sim_media_bytes" in line:
            continue
        line = line.replace("_simulated_replies = []", "ws_service._simulated_replies = []")
        line = line.replace("_sim_media_bytes = None", "ws_service._sim_media_bytes = None")
        line = line.replace("_sim_media_bytes =", "ws_service._sim_media_bytes =")
        line = line.replace("replies = list(_simulated_replies)", "replies = list(ws_service._simulated_replies)")
        
        new_lines.append(line)

with open(file_path, "w") as f:
    f.writelines(new_lines)
