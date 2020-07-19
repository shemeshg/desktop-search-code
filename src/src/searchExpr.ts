
export function splitStrBySpace(orgString: string): string[]{
  let s = orgString.replace(/\(/g," ( ")
  s = s.replace(/\)/g," ) ")
  return s.match(/("[^"]+"|[^ ]+)/g) ?? [];
}

export class SearchExpr {
  private orgStr = ""
  private conditionExpStr = ""
  private testAgainst: string[] = []
  isValid = false;

  constructor(s: string) {
    this.orgStr = s;
  }

  private itemIsOPerand(s: string) {
    return ["and", "AND", "or", "OR", "(", ")"].indexOf(s) > -1
  }


  private getOperand(s: string) {
    if (s.toLowerCase() === "and") return "&&"
    if (s.toLowerCase() === "or") return "||"
    return s;
  }

  evaluateExp(s: string[]): boolean {
    this.testAgainst = s
    return eval( this.conditionExpStr);
  }

  private doTest(s: string){
    const str = unescape(s).replace(/"/g,"").trim();
    return this.testAgainst.indexOf(str) > -1
  }

  parseStr() {
    const e = splitStrBySpace(this.orgStr) 


    if (e.length === 0){
      this.isValid = false;
      return this.isValid;
    }

    const elms: string[] = []
    elms.push(`this.doTest("${escape(e[0])} ")`)
    for (let i = 1; i < e.length; i++) {

      if (this.itemIsOPerand(e[i].toLowerCase())) {
        elms.push(" " + this.getOperand(e[i].toLowerCase()) + " ")
      } else {
        let operand = ""
        if (!this.itemIsOPerand(e[i - 1].toLowerCase())) {
          operand = "&&"          
        }
        elms.push(` ${operand} this.doTest("${escape(e[i])}")`)
      }
    }
    this.conditionExpStr = elms.join("");

    try {
      this.evaluateExp([])
      this.isValid = true;
    } catch (error) {
      this.isValid = false;
    }

    return this.isValid;
  }

}