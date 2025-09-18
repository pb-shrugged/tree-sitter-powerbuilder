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
    $.comment,
    /\s/,
    $.line_continuation,
  ],

  rules: {
    // Top-level rule that detects and routes to appropriate file type
    source_file: $ => seq(
      optional($.export_header),
      choice(
        // Datawindow files start with 'release N;'
        seq($.release_statement, $.datawindow_content),
        // All other files have global type declarations
        seq(optional($.forward_section), $.file_content),
      ),
    ),

    datawindow_content: $ => seq(
      $.datawindow_definition,
      repeat(choice(
        $.datawindow_section,
        $.table_definition,
        $.control_definition,
      )),
    ),

    file_content: $ => choice(
      $.application_content,
      $.function_content,
      $.user_object_content,
      $.window_content,
      $.menu_content,
      $.structure_content,
      $.query_content,
    ),

    // ========================================
    // FILE TYPE CONTENT DEFINITIONS
    // ========================================

    // Application Content
    application_content: $ => seq(
      $.application_type_declaration,
      repeat(choice(
        $.structure_definition,
        $.global_variables_section,
        $.type_variables_section,
        $.instance_declaration,
        $.forward_prototypes_section,
        $.event_implementation,
        $.function_implementation,
        $.on_event_block,
        $.type_implementation,
      )),
    ),

    application_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      caseInsensitive('application'),
      repeat(choice(
        $.property_assignment,
        $.event_declaration,
      )),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    // Function Content
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
    structure_content: $ => $.structure_definition,

    // Window Content
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
    query_content: $ => $.identifier,

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
    export_header: $ => seq(
      $.export_header_line,
      optional($.export_comments_line),
    ),

    export_header_line: $ => seq(
      /HA\$PBExportHeader\$/,
      /[^\\n]+/,
    ),

    export_comments_line: $ => seq(
      /\$PBExportComments\$/,
      /[^\\n]*/,
    ),

    // Forward Declarations
    forward_section: $ => seq(
      caseInsensitive('forward'),
      repeat1(choice(
        $.type_forward_declaration,
        $.global_variable_declaration,
      )),
      caseInsensitive('end'),
      caseInsensitive('forward'),
    ),

    type_forward_declaration: $ => seq(
      choice(
        seq(
          caseInsensitive('global'),
          caseInsensitive('type'),
          $.identifier,
          caseInsensitive('from'),
          $.base_type,
          caseInsensitive('end'),
          caseInsensitive('type'),
        ),
        seq(
          caseInsensitive('type'),
          $.identifier,
          caseInsensitive('from'),
          $.base_type,
          caseInsensitive('within'),
          $.identifier,
          caseInsensitive('end'),
          caseInsensitive('type'),
        ),
      ),
    ),

    global_variable_declaration: $ => seq(
      caseInsensitive('global'),
      $.data_type,
      $.identifier,
    ),

    // Global Types
    global_type_declaration: $ => seq(
      caseInsensitive('global'),
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      $.base_type,
      caseInsensitive('end'),
      caseInsensitive('type'),
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

    null_literal: $ => choice(
      caseInsensitive('null'),
      '!',
    ),

    // Comments
    comment: $ => choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    ),

    line_continuation: $ => '&',
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
