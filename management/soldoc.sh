mkdir docs .flattened
rm docs/*.md
rm .flattened/*
for f in $(find contracts -name *.sol)
  do if [ `basename $f` != "Migrations.sol" ]; then
    file=`basename $f`
    filename="${file%.*}"
    node_modules/.bin/truffle-flattener "$f" > .flattened/"$file"
    node_modules/.bin/solmd .flattened/"$file" --dest docs/"$filename".md
  fi
done
rm -r .flattened
