// Regular Expression For Required Fields ,It's goal to deal with String of Whitespaces Like no String in the Field;

export const strPattern:string=".*\\S+.*";
export const numPattern:string="[0-9]{10}";
export const ExtentionPattern:string="[0-9]{5}";
// export const ExtentionPattern:string="^((?!0|1|2|3|4|5|6|7|8)(9?)[0-9]{4}|[0-9]{4})";
export const Pattern:string="[0-9]*";



//^((?!(0|1|2|3|4|5|6|7|8))[0-9]{5})$