deploy:
	rsync -avz --delete -e ssh src/ myserver:projects/phonenumbers.laflaque.fr/dist/

serve:
	cd src && python3 -m http.server
