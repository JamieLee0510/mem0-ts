export const generateCurrDate = () => {
    // 獲取當前日期
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份從0開始，因此要加1
    const day = now.getDate().toString().padStart(2, "0");

    // 將日期轉換為 YYYY-MM-DD 格式
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};
