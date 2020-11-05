class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
    ];

    excludeFields.forEach(
      (el) => delete queryObj[el]
    );

    console.log(queryObj);

    this.query = this.query.find(queryObj);
    return this;
  }

  search() {
    if (this.queryString.search) {
      console.log(this.queryString);
      this.query = this.query.find({
        $text: {
          $search: `"${this.queryString.search}"`,
        },
      });
    }
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : 'createdAt';

    console.log(sortBy);

    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    const fields = this.queryString.fields
      ? this.queryString.fields
          .split(',')
          .join(' ')
      : '-__v';

    console.log(fields);

    this.query = this.query.select(fields);

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit =
      this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    console.log(
      `page: ${page}, limit: ${limit}, skip: ${skip}`
    );

    this.query = this.query
      .skip(skip)
      .limit(limit);

    this.page = page;
    this.limit = limit;
    return this;
  }
}

module.exports = APIFeatures;
