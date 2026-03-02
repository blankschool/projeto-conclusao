UPDATE public.entrepreneurs 
SET materiais_extras = REPLACE(
  materiais_extras, 
  'https://www.notion.so/blankschool/Dossi-Completo-Tallis-Gomes-21fd77361cee80f5a7f4e9f88a52d1b0', 
  'https://blankschool.notion.site/Dossi-Completo-Tallis-Gomes-21fd77361cee80f5a7f4e9f88a52d1b0?source=copy_link'
) 
WHERE id = 11;