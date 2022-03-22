function swapTwoelementsInArray(arr, i1, i2) {
    const el1Val = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = el1Val;
}

const bubbleSort = (sortByProperty, arr) => {
    let isSwap = true;
    for (let i1 = arr.length - 1; i1 >= 0 && isSwap; i1--) {
        isSwap = false;
        for (let i2 = 0; i2 < i1; i2++) {
            if (arr[i2][sortByProperty] < arr[i2 + 1][sortByProperty]) {
                swapTwoelementsInArray(arr, i2, i2 + 1);
                isSwap = true;
            }
        }
    }
    return arr;
}

module.exports = bubbleSort