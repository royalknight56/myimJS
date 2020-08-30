/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 09:12:24
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 12:03:58
 */
var a=43;
sql={
    fun:async function(){
        return new Promise((res,rej)=>{
            rej()
        })
        a++;
        console.log(a);
    }
}

module.exports=sql;
