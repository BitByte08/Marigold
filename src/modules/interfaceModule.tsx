const setHTML = (tag:string, atbt:string, start_ctnt:number, ctnt:string[]|string)=>{
  let res = `<${tag} ${atbt!=="none"?atbt.replace(',',' '):""}>`;
  if(start_ctnt>0) {
    for (let i = start_ctnt; i < ctnt.length; i++) {
      res += ctnt[i] + " ";
    }
    res += `</${tag[0]}>`
  }
  else {
    res += `${ctnt}</${tag}>`
  }
  return res;
}
export default setHTML;