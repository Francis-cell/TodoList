
export default {
    // 设置颜色
    setRandomColor() {
        const randomColor = this.getRandomColor();
        this.divStyle.backgroundColor = randomColor;
    },
    // 生成一个随机下标
    getRandomIndex(list) {
        return Math.floor(Math.random() * list.length);
    },
    // 随机颜色生成方法
    getRandomColor() {
        // 生成随机颜色值
        // const letters = '0123456789ABCDEF';
        // let color = '#';
        // for (let i = 0; i < 6; i++) {
        //     color += letters[Math.floor(Math.random() * 16)];
        // }

        // 颜色列表
        let colorList = ['F5F0BB', 'DBDFAA', 'B3C890', 'F6C391', 'D4ADFC', 'ECCDB4', 'E76161', 'FFE6C7', 'FFB4B4',
            'B0DAFF', 'FDF4F5', 'E8A0BF', 'A9907E', 'D5B4B4', 'F6F1F1', '8D7B68', 'A4907C', 'C8B6A6', 'F1DEC9',
            'F5EAEA', 'FFB84C', 'F16767', 'B9F3E4', 'FFD4D4', 'FFFBAC', 'FFB26B', '5BC0F8', '86E5FF', 'FFC6D3',
            'FEA1BF', 'E98EAD', 'DFD3C3', 'DFD3C3', 'D0B8A8', 'DFF6FF']

        let randomIndex = this.getRandomIndex(colorList);
        return '#' + colorList[randomIndex];
    },
}