function l(e,r=Date.now()){const a=Number(e.price||0);return e.sale_price!=null&&Number(e.sale_price)<a&&(!e.sale_ends_at||Date.parse(e.sale_ends_at)>r)?Number(e.sale_price):a}export{l as c};
