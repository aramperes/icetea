mkdir temp_dist/
if [ -e dist/config.json ]
  then cp dist/config.json temp_dist/
fi
if [ -e dist/default-config.json ]
  then cp dist/default-config.json temp_dist/
fi
rm -r dist/*
if [ -e temp_dist/config.json ]
  then cp temp_dist/config.json dist/
fi
if [ -e temp_dist/default-config.json ]
  then cp temp_dist/default-config.json dist/
fi
rm -r temp_dist
