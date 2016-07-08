Töröld le azt a könyvtárat, amiben ez a fájl van (plugins/wcsparlexhighlight),
majd hozz létre helyette egy symlinket a Parlex forráskódjában lévő plugin könyvtárra:

ckeditor/plugins/>ln -s [workspace/parlex/]parlex-vaadin-ui-ckeditor/src/main/resources/org/vaadin/openesignforms/ckeditor/widgetset/public/ckeditor/plugins/wcsparlexhighlight ./wcsparlexhighlight

Így a builder a parlex forráskódjában lévő plugin forráskódját fogja befordítani a ckeditorba, nem kell ide-oda másolgatni szerkesztés és buildelés között.
(Mivel szerkeszteni a parlexben lévő plugin forráskódot kell, viszont a ckeditor-builder azt tudja befordítani, ami az ő könyvtárában van.)
