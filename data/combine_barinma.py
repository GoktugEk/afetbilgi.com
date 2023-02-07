import json

result = dict()
for i in range(1, 3):
    with open(f"barinma_{i}.json", "r") as f:
        text = f.read().encode("utf-8")

        data = json.loads(text)

        for item in data:
            if item['city'] not in result:
                result[item['city']] = []

            if item['is_validated'] == 'Doğrulandı':
                item['is_validated'] = True
            elif item['is_validated'] == 'Doğrulanmadı':
                item['is_validated'] = False
            elif item['is_validated'] != False and item['is_validated'] != True:
                assert False

            if not item['address'].startswith('http'):
               item['address'] = None

            result[item['city']].append(item)

out = {
    "type": "question",
    "text": "Hangi şehirde kalacak yer arıyorsunuz?",
    "options": []
}

for city in result.keys():
    out['options'].append({
        "name": city,
        "value": {
            "type": "data",
            "data": {
                "city": city,
                "dataType": "city-accommodation",
                "items": result[city]
            }
        }
    })

print(json.dumps(out, indent=4, ensure_ascii=False))
