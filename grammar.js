/**
 * @file Powerbuilder grammar for tree-sitter
 * @author Jose Cagnini
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  COMMENT: 0,
  ASSIGNMENT: 1,
  TERNARY: 2,
  OR: 3,
  AND: 4,
  EQUALITY: 5,
  RELATIONAL: 6,
  ADDITIVE: 7,
  MULTIPLICATIVE: 8,
  UNARY: 9,
  MEMBER: 10,
  CALL: 11,
  POSTFIX: 12,
  PRIMARY: 13,
};

module.exports = grammar({
  name: 'powerbuilder',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/,
    $.line_continuation,
  ],

  rules: {

    source_file: $ => choice(
      $.datawindow_file,
      $.application_file,
      $.function_file,
      $.structure_file,
      $.user_object_file,
      $.window_file,
      $.menu_file,
      $.query_file,
    ),

    datawindow_file: $ => seq(
      $.datawindow_header_file,
      $.datawindow_content,
    ),

    application_file: $ => seq(
      $.application_header_file,
      $.application_content,
    ),

    function_file: $ => seq(
      $.function_header_file,
      $.function_content,
    ),

    structure_file: $ => seq(
      $.structure_header_file,
      $.structure_content,
    ),

    user_object_file: $ => seq(
      $.user_object_header_file,
      $.user_object_content,
    ),

    window_file: $ => seq(
      $.window_header_file,
      $.window_content,
    ),

    menu_file: $ => seq(
      $.menu_header_file,
      $.menu_content,
    ),

    query_file: $ => seq(
      $.query_header_file,
      $.query_content,
    ),

    // ========================================
    // FILE TYPE CONTENT DEFINITIONS
    // ========================================

    // Application Content
    application_file_extension: _ => 'sra',

    application_header_file: $ => seq(
      $.export_header_name,
      $.application_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    application_content: $ => seq(
      $.forward_section,
      optional($.structure_definition),
      optional($.global_variables_section),
      optional($.type_variables_section),
      optional($.instance_declaration),
      optional($.forward_prototypes_section),
      optional($.event_implementation),
      optional($.function_implementation),
      optional($.on_event_block),
      optional($.type_implementation),
    ),

    // Function Content
    function_file_extension: $ => 'srf',

    function_header_file: $ => seq(
      $.export_header_name,
      $.function_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    function_content: $ => seq(
      $.function_type_declaration,
      repeat(choice(
        $.forward_prototypes_section,
        $.function_implementation,
      )),
    ),

    function_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      caseInsensitive('function_object'),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    // Structure Content
    structure_file_extension: _ => 'srs',

    structure_header_file: $ => seq(
      $.export_header_name,
      $.structure_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    structure_content: $ => $.structure_definition,

    // Window Content
    window_file_extension: _ => 'srw',

    window_header_file: $ => seq(
      $.export_header_name,
      $.window_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    window_content: $ => seq(
      $.window_type_declaration,
      repeat($.type_member),
    ),

    window_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      caseInsensitive('window'),
      repeat(choice(
        $.property_assignment,
        $.event_declaration,
      )),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    // Menu Content
    menu_file_extension: _ => 'srm',

    menu_header_file: $ => seq(
      $.export_header_name,
      $.menu_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    menu_content: $ => seq(
      $.menu_type_declaration,
      repeat($.menu_member),
    ),

    menu_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      caseInsensitive('menu'),
      repeat($.menu_item),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    // User Object Content
    user_object_file_extension: _ => 'sru',

    user_object_header_file: $ => seq(
      $.export_header_name,
      $.user_object_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    user_object_content: $ => seq(
      $.user_object_type_declaration,
      repeat(choice(
        $.shared_variables_section,
        $.type_member,
      )),
    ),

    user_object_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      $.user_object_base_type,
      repeat(choice(
        $.property_assignment,
        $.event_declaration,
      )),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    user_object_base_type: $ => choice(
      caseInsensitive('datawindow'),
      caseInsensitive('userobject'),
      $.identifier, // Custom user object types
    ),

    // Query Content - placeholder
    query_file_extension: _ => 'srq',

    query_header_file: $ => seq(
      $.export_header_name,
      $.query_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    query_content: $ => $.identifier,

    menu_item: $ => seq(
      $.identifier,
      $.identifier,
    ),

    menu_member: $ => choice(
      $.variables_section,
      $.function_prototype,
      $.function_implementation,
    ),

    // ========================================
    // COMMON CONSTRUCTS
    // ========================================

    // Export Headers
    export_header_name: $ => seq(
      /HA\$PBExportHeader\$/,
      field('file_name', $.identifier),
      /\./,
    ),

    export_comments: $ => seq(
      /\$PBExportComments\$/,
      field('comment', $.rest_of_line),
    ),

    rest_of_line: _ => /[^\r\n]*/,

    // Forward Declarations
    forward_section: $ => seq(
      $.forward_keyword,
      $.global_type_declaration,
      repeat($.inner_object_type_declaration),
      repeat($.global_variable_declaration), // Only in application files
      $.end_keyword,
      $.forward_keyword,
    ),

    global_type_declaration: $ => seq(
      $.global_keyword,
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.base_type,
      $.end_keyword,
      $.type_keyword,
    ),

    inner_object_type_declaration: $ => seq(
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.base_type,
      $.within_keyword,
      $.identifier,
      $.end_keyword,
      $.type_keyword,
    ),

    global_variable_declaration: $ => seq(
      $.global_keyword,
      $.data_type,
      field('var_name', $.identifier),
    ),

    base_type: $ => choice(
      caseInsensitive('application'),
      caseInsensitive('window'),
      caseInsensitive('userobject'),
      caseInsensitive('menu'),
      caseInsensitive('structure'),
      caseInsensitive('function_object'),
      caseInsensitive('datawindow'),
      caseInsensitive('transaction'),
      caseInsensitive('dynamicdescriptionarea'),
      caseInsensitive('dynamicstagingarea'),
      caseInsensitive('error'),
      caseInsensitive('message'),
      $.identifier, // For custom types
    ),

    // Structure Definitions
    structure_definition: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      caseInsensitive('structure'),
      repeat1($.structure_field),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    structure_field: $ => seq(
      $.data_type,
      $.identifier,
      optional($.array_suffix),
    ),

    // Variables Sections
    global_variables_section: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('variables'),
      repeat1($.variable_declaration),
      caseInsensitive('end'),
      caseInsensitive('variables'),
    ),

    shared_variables_section: $ => seq(
      caseInsensitive('shared'),
      caseInsensitive('variables'),
      repeat1($.variable_declaration),
      caseInsensitive('end'),
      caseInsensitive('variables'),
    ),

    variables_section: $ => seq(
      caseInsensitive('type'),
      caseInsensitive('variables'),
      repeat1($.variable_declaration),
      caseInsensitive('end'),
      caseInsensitive('variables'),
    ),

    type_variables_section: $ => seq(
      caseInsensitive('type'),
      caseInsensitive('variables'),
      repeat1($.variable_declaration),
      caseInsensitive('end'),
      caseInsensitive('variables'),
    ),

    instance_declaration: $ => prec(2, seq(
      caseInsensitive('global'),
      $.identifier,
      $.identifier,
    )),

    event_implementation: $ => seq(
      caseInsensitive('event'),
      $.identifier,
      optional($.parameter_list),
      ';',
      repeat($.statement),
      caseInsensitive('end'),
      caseInsensitive('event'),
    ),

    on_event_block: $ => prec(2, seq(
      caseInsensitive('on'),
      $.member_expression,
      repeat($.statement),
      caseInsensitive('end'),
      caseInsensitive('on'),
    )),

    variable_declaration: $ => seq(
      optional($.access_modifier),
      $.data_type,
      $.identifier,
      optional($.array_suffix),
      optional(seq('=', $.expression)),
    ),

    access_modifier: $ => choice(
      caseInsensitive('public'),
      caseInsensitive('private'),
      caseInsensitive('protected'),
    ),

    // Function Definitions
    forward_prototypes_section: $ => seq(
      caseInsensitive('forward'),
      caseInsensitive('prototypes'),
      repeat1($.function_prototype),
      caseInsensitive('end'),
      caseInsensitive('prototypes'),
    ),

    function_prototype: $ => seq(
      optional($.access_modifier),
      choice(
        seq(caseInsensitive('function'), $.data_type),
        caseInsensitive('subroutine'),
      ),
      $.identifier,
      $.parameter_list,
    ),

    function_implementation: $ => seq(
      $.function_prototype,
      ';',
      repeat($.statement),
      choice(
        caseInsensitive('end function'),
        caseInsensitive('end subroutine'),
      ),
    ),

    function_body: $ => repeat1($.statement),

    parameter_list: $ => seq(
      '(',
      commaSep($.parameter),
      ')',
    ),

    parameter: $ => seq(
      optional(choice(
        caseInsensitive('ref'),
        caseInsensitive('readonly'),
      )),
      $.data_type,
      $.identifier,
      optional($.array_suffix),
    ),

    // Event Definitions
    event_declaration: $ => seq(
      caseInsensitive('event'),
      optional(seq(caseInsensitive('type'), $.data_type)),
      $.identifier,
      optional($.parameter_list),
      optional($.event_id),
    ),

    event_id: $ => /pbm_[a-zA-Z_][a-zA-Z0-9_]*/,

    // Type Members
    type_member: $ => choice(
      $.property_assignment,
      $.event_declaration,
      $.function_implementation,
      $.variables_section,
    ),

    type_implementation: $ => seq(
      caseInsensitive('global'),
      $.identifier,
      $.identifier,
    ),

    // Property Assignments
    property_assignment: $ => seq(
      $.identifier,
      '=',
      $.property_value,
    ),

    property_value: $ => $.expression,

    property_list: $ => commaSep1($.property_assignment),

    // ========================================
    // EXPRESSIONS AND STATEMENTS
    // ========================================

    statement: $ => choice(
      $.assignment_statement,
      $.return_statement,
      $.if_statement,
      $.choose_statement,
      $.loop_statement,
      $.expression_statement,
    ),

    assignment_statement: $ => prec(PREC.ASSIGNMENT, seq(
      $.lvalue,
      '=',
      $.expression,
    )),

    return_statement: $ => prec.left(seq(
      caseInsensitive('return'),
      optional($.expression),
    )),

    if_statement: $ => seq(
      caseInsensitive('if'),
      $.expression,
      caseInsensitive('then'),
      repeat($.statement),
      repeat($.elseif_clause),
      optional($.else_clause),
      caseInsensitive('end'),
      caseInsensitive('if'),
    ),

    elseif_clause: $ => seq(
      caseInsensitive('elseif'),
      $.expression,
      caseInsensitive('then'),
      repeat($.statement),
    ),

    else_clause: $ => seq(
      caseInsensitive('else'),
      repeat($.statement),
    ),

    choose_statement: $ => seq(
      caseInsensitive('choose'),
      caseInsensitive('case'),
      $.expression,
      repeat($.case_clause),
      optional($.case_else_clause),
      caseInsensitive('end'),
      caseInsensitive('choose'),
    ),

    case_clause: $ => seq(
      caseInsensitive('case'),
      commaSep1($.expression),
      repeat($.statement),
    ),

    case_else_clause: $ => seq(
      caseInsensitive('case'),
      caseInsensitive('else'),
      repeat($.statement),
    ),

    loop_statement: $ => choice(
      $.do_loop,
      $.for_loop,
      $.while_loop,
    ),

    do_loop: $ => seq(
      caseInsensitive('do'),
      repeat($.statement),
      caseInsensitive('loop'),
      optional(seq(caseInsensitive('while'), $.expression)),
    ),

    for_loop: $ => seq(
      caseInsensitive('for'),
      $.identifier,
      '=',
      $.expression,
      caseInsensitive('to'),
      $.expression,
      optional(seq(caseInsensitive('step'), $.expression)),
      repeat($.statement),
      caseInsensitive('next'),
    ),

    while_loop: $ => seq(
      caseInsensitive('do'),
      caseInsensitive('while'),
      $.expression,
      repeat($.statement),
      caseInsensitive('loop'),
    ),

    expression_statement: $ => seq(
      $.expression,
    ),

    // Expressions
    expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.member_expression,
      $.function_call,
      $.array_access,
      $.parenthesized_expression,
      $.primary_expression,
    ),

    binary_expression: $ => choice(
      prec.left(PREC.OR, seq($.expression, caseInsensitive('or'), $.expression)),
      prec.left(PREC.AND, seq($.expression, caseInsensitive('and'), $.expression)),
      prec.left(PREC.EQUALITY, seq($.expression, choice('=', '<>'), $.expression)),
      prec.left(PREC.RELATIONAL, seq($.expression, choice('<', '>', '<=', '>='), $.expression)),
      prec.left(PREC.ADDITIVE, seq($.expression, choice('+', '-'), $.expression)),
      prec.left(PREC.MULTIPLICATIVE, seq($.expression, choice('*', '/', '^'), $.expression)),
    ),

    unary_expression: $ => choice(
      prec(PREC.UNARY, seq(caseInsensitive('not'), $.expression)),
      prec(PREC.UNARY, seq('-', $.expression)),
      prec(PREC.UNARY, seq('+', $.expression)),
    ),

    member_expression: $ => prec(PREC.MEMBER, seq(
      $.expression,
      '.',
      $.identifier,
    )),

    function_call: $ => prec(PREC.CALL, seq(
      $.identifier,
      '(',
      commaSep($.expression),
      ')',
    )),

    array_access: $ => prec(PREC.POSTFIX, seq(
      $.expression,
      '[',
      $.expression,
      ']',
    )),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')',
    ),

    primary_expression: $ => choice(
      $.identifier,
      $.number,
      $.string_literal,
      $.boolean_literal,
      $.null_literal,
    ),

    lvalue: $ => prec(1, choice(
      $.identifier,
      $.member_expression,
      $.array_access,
    )),

    // ========================================
    // BASIC TYPES AND LITERALS
    // ========================================

    data_type: $ => choice(
      caseInsensitive('string'),
      caseInsensitive('integer'),
      caseInsensitive('long'),
      caseInsensitive('boolean'),
      caseInsensitive('decimal'),
      caseInsensitive('real'),
      caseInsensitive('double'),
      caseInsensitive('date'),
      caseInsensitive('time'),
      caseInsensitive('datetime'),
      caseInsensitive('blob'),
      caseInsensitive('any'),
      caseInsensitive('powerobject'),
      caseInsensitive('datawindow'),
      $.identifier, // Custom types
    ),

    array_suffix: $ => seq('[', ']'),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => choice(
      /\d+/,
      /\d*\.\d+/,
      /\d+[eE][+-]?\d+/,
      /\d*\.\d+[eE][+-]?\d+/,
    ),

    string_literal: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq('\'', repeat(choice(/[^'\\]/, /\\./)), '\''),
    ),

    boolean_literal: $ => choice(
      caseInsensitive('true'),
      caseInsensitive('false'),
    ),

    null_literal: _ => caseInsensitive('null'),

    // Comments
    line_comment: _ => seq('//', /.*/),

    block_comment: _ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),

    line_continuation: $ => '&',

    // Datawindow Content
    datawindow_file_extension: _ => 'srd',

    datawindow_header_file: $ => seq(
      $.export_header_name,
      $.datawindow_file_extension,
      /[\r?\n]/,
      optional($.export_comments),
    ),

    datawindow_content: $ => seq(
      $.release_statement,
      $.datawindow_definition,
      repeat(choice(
        $.datawindow_section,
        $.table_definition,
        $.control_definition,
      )),
    ),

    // Datawindow Definitions
    release_statement: $ => seq(
      caseInsensitive('release'),
      $.number,
      ';',
    ),

    datawindow_definition: $ => seq(
      caseInsensitive('datawindow'),
      '(',
      $.property_list,
      ')',
    ),

    datawindow_section: $ => choice(
      $.header_section,
      $.detail_section,
      $.footer_section,
      $.summary_section,
    ),

    header_section: $ => seq(
      caseInsensitive('header'),
      '(',
      $.property_list,
      ')',
    ),

    detail_section: $ => seq(
      caseInsensitive('detail'),
      '(',
      $.property_list,
      ')',
    ),

    footer_section: $ => seq(
      caseInsensitive('footer'),
      '(',
      $.property_list,
      ')',
    ),

    summary_section: $ => seq(
      caseInsensitive('summary'),
      '(',
      $.property_list,
      ')',
    ),

    table_definition: $ => seq(
      caseInsensitive('table'),
      '(',
      repeat1($.column_definition),
      ')',
    ),

    column_definition: $ => seq(
      caseInsensitive('column'),
      '=',
      '(',
      $.property_list,
      ')',
    ),

    control_definition: $ => choice(
      $.column_control,
      $.text_control,
    ),

    column_control: $ => seq(
      caseInsensitive('column'),
      '(',
      $.property_list,
      ')',
    ),

    text_control: $ => seq(
      caseInsensitive('text'),
      '(',
      $.property_list,
      ')',
    ),

    // Keyword
    forward_keyword: _ => caseInsensitive('forward'),

    end_keyword: _ => caseInsensitive('end'),

    global_keyword: _ => caseInsensitive('global'),

    type_keyword: _ => caseInsensitive('type'),

    from_keyword: _ => caseInsensitive('from'),

    release_keyword: _ => caseInsensitive('release'),

    within_keyword: _ => caseInsensitive('within'),

    variables_keyword: _ => caseInsensitive('variables'),

    shared_keyword: _ => caseInsensitive('shared'),

    event_keyword: _ => caseInsensitive('event'),

    on_keyword: _ => caseInsensitive('on'),

    public_keyword: _ => caseInsensitive('public'),

    private_keyword: _ => caseInsensitive('private'),

    protected_keyword: _ => caseInsensitive('protected'),

    prototypes_keyword: _ => caseInsensitive('prototypes'),

    function_keyword: _ => caseInsensitive('function'),

    subroutine_keyword: _ => caseInsensitive('subroutine'),

    ref_keyword: _ => caseInsensitive('ref'),

    readonly_keyword: _ => caseInsensitive('readonly'),

    return_keyword: _ => caseInsensitive('return'),

    if_keyword: _ => caseInsensitive('if'),

    then_keyword: _ => caseInsensitive('then'),

    elseif_keyword: _ => caseInsensitive('elseif'),

    else_keyword: _ => caseInsensitive('else'),

    choose_keyword: _ => caseInsensitive('choose'),

    case_keyword: _ => caseInsensitive('case'),

    do_keyword: _ => caseInsensitive('do'),

    loop_keyword: _ => caseInsensitive('loop'),

    while_keyword: _ => caseInsensitive('while'),

    for_keyword: _ => caseInsensitive('for'),

    to_keyword: _ => caseInsensitive('to'),

    step_keyword: _ => caseInsensitive('step'),

    next_keyword: _ => caseInsensitive('next'),

    or_keyword: _ => caseInsensitive('or'),

    and_keyword: _ => caseInsensitive('and'),

    not_keyword: _ => caseInsensitive('not'),

  },
});

/**
 * Generates a case-insensitive regular expression for a given keyword.
 *
 * @param {string} keyword
 * @param {boolean} aliasAsWord
 * @returns {RegExp | AliasRule}
 */
function caseInsensitive(keyword, aliasAsWord = true) {
  const result = new RegExp(
    keyword.
      split('')
      .map(letter => letter !== letter.toUpperCase() ? `[${letter}${letter.toUpperCase()}]` : letter)
      .join(''));
  if (aliasAsWord) {
    return alias(result, keyword);
  }
  return result;
}

/**
 * Creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @returns {ChoiceRule}
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
