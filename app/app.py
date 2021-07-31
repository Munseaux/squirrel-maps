from flask import Flask, render_template, redirect

app = Flask(__name__)

#primary routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/elections")
def elections():
    return render_template("elections.html")

@app.route("/expansion")
def expansion():
    return render_template("expansion.html")


#redirects and workarounds
@app.route("/static/templates/index.html")
def index_redirect():
    return redirect("/", code=302)
@app.route("/index.html")
def index_redirect_2():
    return redirect("/", code=302)

@app.route("/static/templates/elections.html")
def elections_redirect():
    return redirect("/elections", code=302)
@app.route("/elections.html")
def elections_redirect_2():
    return redirect("/elections", code=302)

@app.route("/static/templates/expansion.html")
def expansion_redirect():
    return redirect("/expansion", code=302)
@app.route("/expansion.html")
def expansion_redirect_2():
    return redirect("/expansion", code=302)

if __name__ == '__main__':
    app.run(debug=True)

    