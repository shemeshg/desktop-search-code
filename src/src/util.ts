export function downloadFileAsString(filename:  string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// eslint-disable-next-line
export function readFileAsString(el: any): Promise<any> {
  return new Promise( (resolve)=>{

      if (el.files.length === 0) {            
          return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
          resolve(event.target?.result);
      };
      reader.readAsText(el.files[0]);
  })

}