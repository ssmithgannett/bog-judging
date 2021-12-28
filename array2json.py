import json

@app.route('/_array2python')
def array2python():
    wordlist = json.loads(request.args.get('wordlist'))
    # do some stuff
    return jsonify(result=wordlist)