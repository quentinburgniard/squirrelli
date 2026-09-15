import { createNameSearch } from './name-search';

describe('merchant name search', () => {
  const merchants = [{ name: 'Migros' }, { name: 'Café Central' }, { name: 'Coop' }];
  const search = createNameSearch(merchants, (merchant) => merchant.name);

  it('matches typos, accents, case and names away from the start', () => {
    expect(search('Migors')).toEqual([merchants[0]]);
    expect(search(' CAFE ')).toEqual([merchants[1]]);
    expect(search('Central')).toEqual([merchants[1]]);
  });

  it('restores all options for an empty query and excludes unrelated names', () => {
    expect(search('   ')).toEqual(merchants);
    expect(search('zzzzzz')).toEqual([]);
  });

  it('ranks exact matches first and supports category fallback', () => {
    const expenses = [
      { merchant: { name: 'Cooper' }, category: null },
      { merchant: null, category: { name: 'Coop' } },
    ];
    const searchExpenses = createNameSearch(
      expenses,
      (expense) => expense.merchant?.name || expense.category?.name || '',
    );
    expect(searchExpenses('Coop')[0]).toBe(expenses[1]);
  });
});
