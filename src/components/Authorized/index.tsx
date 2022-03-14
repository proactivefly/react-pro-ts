import Authorized from "./Authorized";
import Secured from "./Secured";
// 
import check from "./CheckPermissions";
import renderAuthorize from "./renderAuthorize";

Authorized.Secured = Secured;
// 添加了一个check方法
Authorized.check = check;


// 返回的是一个函数（这个函数返回一个Authorized)
const RenderAuthorize = renderAuthorize(Authorized);
// console.log('RenderAuthorize',RenderAuthorize)

export default RenderAuthorize;
