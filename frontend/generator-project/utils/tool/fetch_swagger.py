#!/usr/bin/env python3
"""Fetch swagger from running backend and transform it to match generator format."""
import json
import sys
import urllib.request

url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8086/api-docs"
output = sys.argv[2] if len(sys.argv) > 2 else "./swagger/account-holding.json"

with urllib.request.urlopen(url) as resp:
    spec = json.loads(resp.read().decode())

# Add Authorization header param to match other swagger files' pattern
for path, methods in spec.get("paths", {}).items():
    for method, details in methods.items():
        if isinstance(details, dict):
            if "parameters" not in details:
                details["parameters"] = []
            has_auth = any(
                p.get("name") == "Authorization"
                for p in details.get("parameters", [])
            )
            if not has_auth:
                details["parameters"].insert(
                    0,
                    {
                        "description": "SessionJwt passed from consumer",
                        "in": "header",
                        "name": "Authorization",
                        "required": True,
                        "schema": {"type": "string"},
                    },
                )

# Fix content type from */* to application/json
for path, methods in spec.get("paths", {}).items():
    for method, details in methods.items():
        if isinstance(details, dict):
            for code, resp_obj in details.get("responses", {}).items():
                if "content" in resp_obj and "*/*" in resp_obj["content"]:
                    resp_obj["content"]["application/json"] = resp_obj[
                        "content"
                    ].pop("*/*")

with open(output, "w", encoding="utf-8") as f:
    json.dump(spec, f, indent=4, ensure_ascii=False)

print(f"Swagger spec saved to {output}")
