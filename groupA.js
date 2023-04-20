/*
Criteria
(3): colType + formatCurrency
(4): All above + COLUMN_TYPE + sortBy
(5): All above + groupBy
(6): All above +  enumerateData
 */

/**
 * Object containing string constants representing different data types that can be displayed in a table column.
 */
export const COLUMN_TYPE = {
    TEXT: 'text',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'date',
    TIME: 'time',
    TIMESPAN: 'timespan',
    CHECKBOX: 'checkbox',
    STATUS: 'status',
    ENUM: 'enum',
    CURRENCY: 'currency'
};

/**
 * @param {object} c - An object containing information about the table column.
 * @param {object} item - An object representing a single row of data in the table.
 * @returns {string} The data type to display in the table column.
 */
export const colType = (c, item) => c.dynamicType?.(item) || c.type;

/** 
* @param {number} value - The numeric value to format as currency.
* @returns {string} The currency formatted string.
*/
export const formatCurrency = (value) => "$" + value.toString();


/**
 * External function
 * @param value
 * @returns {*} formatted time string
 */
const formatTime = value => value;

/**
 * External function
 * @param value
 * @returns {*} formatted TimeSpan string
 */
const formatTimeSpan = value => value;

/**
 * External function.
 * @param value
 * @returns {*} formatted Date object
 */
const formatDate = value => value;

/**
 * Sorts an array of objects by one or more keys.
 * @param {Array} array - The array to sort.
 * @param {Array|string} keys - The key or keys to sort by. Can be either a string representing a single key or an array of strings representing multiple keys.
 * @param {boolean} [asc=true] - Whether to sort in ascending or descending order. Defaults to true (ascending).
 * @param {function} [valueFormatter] - A function that takes in a value and returns a formatted version of it to use for sorting.
 * @param {function} [ifCallback] - A callback function that takes in two values and returns whether the comparison between them should be skipped. Can be used to handle special cases such as null or undefined values.
 * @returns {Array} The sorted array.
 */
export function sortBy(array, keys, asc = true, valueFormatter = undefined, ifCallback = undefined) {
    return array.slice().sort((a, b) => comparator(a, b, keys, asc, valueFormatter, ifCallback));
}

export function formatCellContent(col, item) {
    let formattedValue = col.key ? item[col.key] : item;

    if (col.format)
        formattedValue = col.format(item, col.key,);

    if (typeof formattedValue === 'number')
        switch (col.type) {
            case COLUMN_TYPE.TIME:
                formattedValue = formatTime(formattedValue); break;
            case COLUMN_TYPE.TIMESPAN:
                formattedValue = formatTimeSpan(formattedValue); break;
            case COLUMN_TYPE.DATE:
                formattedValue = formatDate(formattedValue); break;
            case COLUMN_TYPE.CURRENCY:
                formattedValue = formatCurrency(formattedValue); break;
        }
    else if (col.type == COLUMN_TYPE.STATUS)
        formattedValue = col.template(item);

    return formattedValue;
}

/**
 * Groups a list of objects by a specified key.
 * @param {Array} list - The list of objects to group.
 * @param {string} key - The key to group the objects by.
 * @returns {Object} An object where the keys are the unique values of the specified key in the list,
 * and the values are arrays of objects that have that value for the specified key.
 */
export function groupBy(list, key) {
    return list.reduce((res, x) => {
        (res[x[key]] = res[x[key]] || []).push(x);
        return res;
    }, {});
}

/**
 * Creates an HTML unordered list element from an array of objects and a property name to display.
 * @param {Array} data - The array of objects to display in the list.
 * @param {string} propertyName - The name of the property of each object to display in the list item.
 * @returns {HTMLElement} An HTML unordered list element with list items for each object in the input array.
 * Each list item displays the value of the specified property of the corresponding object.
 * When a list item is clicked, a 'item_selected' custom event is dispatched on the item with the corresponding object as the 'item' property of the event detail.
 * @throws {Error} If the data parameter is not an array.
 */
export function enumerateData(data, propertyName) {

    if (!data || !Array.isArray(data))
        throw new Error("Data parameter should be array")

    const list = document.createElement('ul');

    for (let i = 0; i < data.length; i++) {
        const li = document.createElement('li');
        const clickEvent = new CustomEvent('item_selected', {item: data[i]})

        li.innerText = data[i][propertyName] || '';
        li.addEventListener('click', (e) => li.dispatchEvent(clickEvent))

        list.appendChild(li);
    }

    return list;
}


/**
 * External function. Do not put documentation on this.
 * @param a {any}
 * @param b {any}
 * @param keys {string[]}
 * @param asc {boolean}
 * @param valueFormatter {function}
 * @param ifCallback {function}
 * @returns {boolean}
 */
function comparator(a, b, keys, asc, valueFormatter, ifCallback) {
}