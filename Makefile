DESTDIR=build

.PHONY: clean
clean:
	@echo "🧹 Cleaning old build"
	cd $(DESTDIR) && rm -rf *

createDestDir:
	@echo "🧹 Cleaning old build"
	mkdir -p ${DESTDIR}

scrape: createDestDir
	node tools/index.js > ${DESTDIR}/dosomethingnewservice.json