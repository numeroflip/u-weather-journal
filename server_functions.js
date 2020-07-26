/** 
 * Replace '-s to '' in the input string 
 * 
 *@name prepareStringForSQL 
 *@param {String} 
 *@returns {String}
 */
 function prepareStringForSQL(string) {
    let output = string
    if ((typeof(string) ==="string") && string.includes("'"))
        {
            output = string.replace(/'/gi, "''")
        }
    return output
}
/** 
 * Replace '-s to '' in the the input object's string values 
 * 
 *@name prepareObjForSQL 
 *@param {Object} 
 *@returns {Object} - new object with string values updated
 */
module.exports = (function prepareObjForSQL(obj) {
    let newData = {};
    Object.keys(obj).map(key => {
        const value = obj[key];
        newData[key] = prepareStringForSQL(value);
    })
    return newData;
})