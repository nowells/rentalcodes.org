# Migration step

```bash
wget -mk http://www.rentalcodes.org/index.php
find . -depth -name "*.php" -exec sh -c 'mv "$1" "${1%.php}.html"' _ {} \;
find . -depth -name "*.html" | xargs sed -i -e "s/\.php/.html/g"
find . -depth -name "*-e" -exec rm {} \;
```
