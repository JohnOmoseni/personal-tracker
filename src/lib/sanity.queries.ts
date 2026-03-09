import { defineQuery } from "next-sanity";

export const USER_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && (clerkUserId == $clerkUserId || user->clerkId == $clerkUserId)] | order(name asc) {
    _id,
    name,
    type,
    color,
    icon
  }
`);

export const USER_TRANSACTIONS_QUERY = defineQuery(`
  *[_type == "transaction" && (clerkUserId == $clerkUserId || user->clerkId == $clerkUserId)] | order(date desc, _createdAt desc) [$start...$end] {
    _id,
    amount,
    type,
    description,
    date,
    category->{
      _id,
      name,
      color,
      icon
    }
  }
`);

export const USER_ALL_TRANSACTIONS_QUERY = defineQuery(`
  *[_type == "transaction" && (clerkUserId == $clerkUserId || user->clerkId == $clerkUserId) && ($search == "" || description match $search + "*" || category->name match $search + "*")] | order(date desc) {
    _id,
    amount,
    type,
    description,
    date,
    category->{
      _id,
      name,
      color,
      icon
    }
  }
`);

export const USER_BUDGETS_QUERY = defineQuery(`
  *[_type == "budget" && (clerkUserId == $clerkUserId || user->clerkId == $clerkUserId)] {
    _id,
    amount,
    category->{
      _id,
      name,
      color,
      icon
    }
  }
`);
