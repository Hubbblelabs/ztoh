#!/bin/bash

# Test GET without auth
echo "Testing GET /api/admin/settings without auth..."
curl -i -X GET http://localhost:3000/api/admin/settings

# Test PUT without auth
echo -e "\n\nTesting PUT /api/admin/settings without auth..."
curl -i -X PUT http://localhost:3000/api/admin/settings -H "Content-Type: application/json" -d '{"emailSettings": {"adminEmail": "test@example.com"}}'
