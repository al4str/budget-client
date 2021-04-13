const VALUES = {
  'titles.profile': 'Profile',
  'titles.main': 'Main',
  'titles.create-income': 'New income',
  'titles.create-expense': 'New expanse',
  'titles.categories': 'Categories',
  'titles.category': 'Category',
  'titles.category-create': 'New category',
  'titles.commodity-create': 'New commodity',
  'titles.expenditure-create': 'New expenditure',
  //
  'errors.db.invalid-name': '[DB] Invalid name',
  'errors.db.invalid-user': '[DB] Invalid user',
  'errors.db.invalid-selector': '[DB] Invalid selector',
  'errors.resize.invalid-params': '[RESIZER] Invalid params',
  'errors.sessions.corrupted-token': '[SESSIONS] Corrupted token',
  'errors.sessions.unknown-token': '[SESSIONS] Unknown token',
  'errors.sessions.unknown-user': '[SESSIONS] Unknown user',
  'errors.sessions.wrong-user': '[SESSIONS] Wrong user',
  'errors.sessions.wrong-session': '[SESSIONS] Wrong session',
  'errors.resource.invalid-params': '[RESOURCE] Invalid params',
  'errors.resource.not-exist': '[RESOURCE] Does not exist',
  'errors.resource.already-exist': '[RESOURCE] Already exist',
  'errors.resource.unknown-user': '[RESOURCE] Unknown user',
  'errors.categories.invalid-id': '[CATEGORIES] Invalid machine name',
  'errors.categories.invalid-title': '[CATEGORIES] Invalid title',
  'errors.categories.invalid-type': '[CATEGORIES] Invalid type',
  'errors.commodities.invalid-id': '[CATEGORIES] Invalid machine name',
  'errors.commodities.invalid-title': '[COMMODITIES] Invalid title',
  'errors.commodities.invalid-category': '[COMMODITIES] Invalid category',
  'errors.expenditures.invalid-id': '[COMMODITIES] Invalid machine name',
  'errors.expenditures.invalid-expense': '[EXPENDITURES] Invalid expense',
  'errors.expenditures.invalid-commodity': '[EXPENDITURES] Invalid commodity',
  'errors.expenses.invalid-id': '[EXPENDITURES] Invalid ID',
  'errors.expenses.invalid-user': '[EXPENSES] Invalid user',
  'errors.expenses.invalid-category': '[EXPENSES] Invalid category',
  'errors.expenses.invalid-date': '[EXPENSES] Invalid date',
  'errors.expenses.invalid-sum': '[EXPENSES] Invalid sum',
  'errors.income.invalid-id': '[EXPENSES] Invalid ID',
  'errors.income.invalid-user': '[INCOME] Invalid user',
  'errors.income.invalid-category': '[INCOME] Invalid category',
  'errors.income.invalid-date': '[INCOME] Invalid date',
  'errors.income.invalid-sum': '[INCOME] Invalid sum',
  //
  'errors.chunks.messages': 'You tried navigating to/loading a page/resource, that is no longer available',
  'errors.chunks.title': 'Application might be stale 🏚',
  'errors.default.title': 'Something went wrong 😢',
  'errors.offline.message': 'Your device seems to be offline or using slow internet connection or "lie-fi"',
  'errors.offline.title': 'Your are offline 🔴',
  'errors.reload': 'Please, reload the page',
  //
  'forms.errors.empty': 'Empty value',
  'forms.errors.invalid-type': 'Invalid type',
  'forms.errors.invalid-size': 'Invalid size',
  'forms.errors.invalid-dimensions': 'Invalid dimensions',
  'forms.errors.invalid-id': 'Invalid ID',
  'forms.errors.invalid-machine-name': 'Invalid ID',
  'forms.errors.invalid-sum': 'Invalid amount',
  'forms.errors.already-exist': 'Already exist',
  'forms.errors.does-not-exist': 'Does not exist',
  'forms.select.placeholder': 'Nothing to select',
  'forms.id.label': 'Machine name',
  'forms.id.placeholder': 'machine-name',
  'forms.id.desc': 'Enter a unique name for soulless machines. Use only: "a-z", "A-Z", "0-9", "-", "_"',
  'forms.name.label': 'Title for humans',
  'forms.name.placeholder': 'Title',
  'forms.type.label': 'Select a type',
  'forms.type.placeholder': 'Type',
  'forms.comment.label': 'Comment (optional)',
  'forms.comment.placeholder': 'Comment',
  'forms.category.label': 'Select a category',
  'forms.category.placeholder': 'Category',
  'forms.amount.label': 'Amount',
  'forms.amount.placeholder': '0.00',
  'forms.essential.label': 'Is essential',
  'forms.actions.search': 'Search',
  'forms.actions.next': 'Next',
  'forms.actions.confirm': 'Confirm',
  'forms.actions.save': 'Save',
  'forms.actions.create': 'Create',
  'forms.actions.ok': 'OK',
  //
  'profile.id.label': 'Enter your username',
  'profile.id.placeholder': 'Username',
  'profile.name.label': 'Real name',
  'profile.avatar.label': 'Avatar',
  //
  'categories.type.income': 'Income',
  'categories.type.expense': 'Expense',
  //
  'expenditures.essential.yes': 'is essential',
  'expenditures.essential.no': 'is not essential',
  //
  'messages.welcome': 'Welcome back, my lord',
  //
  'create.titles.sum': 'How much',
  'create.titles.category': 'Category',
  'create.titles.commodities': 'What for',
  'create.titles.date': 'When',
  'create.titles.user': 'Who',
  'create.titles.confirm': 'Confirmation',
  //
  'month.total.caption': 'Total',
  'month.total.income': 'Income',
  'month.total.expenses': 'Expenses',
  'month.total.rest': 'Balance',
  'month.date.when': 'When',
  'month.users.by': 'By',
};

/**
 * @param {string} key
 * @return {string}
 * */
export function useT9n(key) {
  return typeof VALUES[key] === 'string'
    ? VALUES[key]
    : key;
}

/**
 * @template {string} Key
 * @template {string} Value
 * @template {string} Name
 *
 * @param {Record<Name, Key>} keys
 *
 * @return {Record<Name, Value>}
 * */
export function useT9ns(keys) {
  return Object
    .entries(keys)
    .reduce((result, [name, key]) => {
      result[name] = typeof VALUES[key] === 'string'
        ? VALUES[key]
        : key;
      return result;
    }, {});
}