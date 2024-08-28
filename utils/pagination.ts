exports.pageOffset = ( page:number = 1, pageSize:number = 8 )=>{
    const offset = (page - 1) * pageSize;
    return offset;
}

exports.resPagination = (data : object, count :number, page: number, pageSize:number, key: string = "data"  ) =>{
  const totalPages = Math.ceil(count / pageSize);
  const offset = (page - 1) * pageSize;
  
  return {
      [key]: data, // 동적 사용
      currentPage: page,
      totalPages,
      totalReviews: count,
  };
};