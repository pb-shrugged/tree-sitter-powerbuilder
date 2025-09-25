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
  VALUE_BY: 14,
  ACCESS_MODIFIER: 15,
  VARIABLE_DECL_ACCESS: 16,
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
      field('header', $.application_header_file),
      field('content', $.application_content),
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
      optional($.structure_definition_section),
      optional($.shared_variables_section),
      optional($.global_variables_section),
      $.global_type_definition,
      $.global_var_declaration,
      optional($.type_variables_section),
      optional($.forward_prototypes_section),
      optional($.event_implementation_section),
      optional($.function_implementation_section),
      optional($.on_event_block_section),
      optional($.second_event_implementation_section),
      optional($.type_implementation_section),
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

    structure_content: $ => seq(
      $.global_keyword,
      $.structure_definition,
    ),

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
      optional($.autoinstantiate_modifier),
      repeat(choice(
        $.property_assignment,
        $.event_declaration,
        $.nested_object_declaration,
        $.type_variables_section,
      )),
      caseInsensitive('end'),
      caseInsensitive('type'),
      optional($.global_instance_declaration),
    ),

    user_object_base_type: $ => choice(
      caseInsensitive('datawindow'),
      caseInsensitive('datastore'),
      caseInsensitive('userobject'),
      caseInsensitive('nonvisualobject'),
      $.identifier, // Custom user object types
    ),

    autoinstantiate_modifier: $ => caseInsensitive('autoinstantiate'),

    global_instance_declaration: $ => seq(
      caseInsensitive('global'),
      $.identifier,
      $.identifier,
    ),

    nested_object_declaration: $ => seq(
      $.identifier,
      $.identifier,
      optional($.descriptor_clause),
    ),

    descriptor_clause: $ => seq(
      caseInsensitive('descriptor'),
      $.string_literal,
      '=',
      $.string_literal,
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
      $.type_variables_section,
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
      field('init', $.forward_keyword),
      field(
        'body',
        $.forward_section_body,
      ),
      field('end', $.end_forward_keyword),
    ),

    forward_section_body: $ => seq(
      $.global_type_declaration,
      repeat($.inner_object_type_declaration),
      repeat($.global_variable_declaration), // Only in application files
    ),

    global_type_declaration: $ => seq(
      $.global_keyword,
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.base_type,
      $.end_type_keyword,
    ),

    inner_object_type_declaration: $ => seq(
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.base_type,
      $.within_keyword,
      $.identifier,
      $.end_type_keyword,
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
      caseInsensitive('nonvisualobject'),
      caseInsensitive('menu'),
      caseInsensitive('structure'),
      caseInsensitive('function_object'),
      caseInsensitive('datawindow'),
      caseInsensitive('datastore'),
      caseInsensitive('transaction'),
      caseInsensitive('dynamicdescriptionarea'),
      caseInsensitive('dynamicstagingarea'),
      caseInsensitive('error'),
      caseInsensitive('message'),
      caseInsensitive('exception'),
      $.identifier, // For custom types
    ),

    // Structure Definitions
    structure_definition_section: $ => repeat1(
      $.structure_definition,
    ),

    structure_definition: $ => seq(
      field(
        'init',
        $.structure_definition_init,
      ),
      field('body', $.structure_definition_body),
      field('end', $.end_type_keyword),
    ),

    structure_definition_init: $ => seq(
      $.type_keyword,
      $.identifier,
      $.from_keyword,
      $.structure_keyword,
    ),

    structure_definition_body: $ => repeat1($.structure_field),

    structure_field: $ => seq(
      $.data_type,
      $.structure_field_separator,
      $.identifier,
      optional($.array_suffix),
    ),

    structure_field_separator: $ => /\t\t/,

    // Variables Sections
    global_variables_section: $ => seq(
      field('init', $.global_variables_keyword),
      field('body', $.global_variables_section_body),
      field('end', $.end_variables_keyword),
    ),

    global_variables_section_body: $ => repeat1($.variable_declaration),

    shared_variables_section: $ => seq(
      field('init', $.shared_variables_keyword),
      field('body', $.shared_variables_section_body),
      field('end', $.end_variables_keyword),
    ),

    shared_variables_section_body: $ => repeat1($.variable_declaration),

    access_section: $ => prec(PREC.ACCESS_MODIFIER, seq(
      $.access_modifier,
      ':',
    )),

    type_variables_section: $ => seq(
      field('init', $.type_variables_keyword),
      field('body', optional($.type_variables_section_body)),
      field('end', $.end_variables_keyword),
    ),

    type_variables_section_body: $ => repeat1(choice(
      prec(PREC.VARIABLE_DECL_ACCESS, $.variable_declaration_with_access),
      seq(
        $.access_section,
        repeat1($.variable_declaration_no_access),
      ),
    )),

    global_type_definition: $ => prec.right(seq(
      field('init', $.global_type_definition_init),
      field('body', repeat(choice(
        $.event_declaration,
        $.inner_object_var_declaration,
      ))),
      field('end', $.end_type_keyword),
    )),

    global_type_definition_init: $ => seq(
      $.global_keyword,
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.base_type,
    ),


    global_var_declaration: $ => $.type_implementation,

    inner_object_var_declaration: $ => $.variable_declaration,

    function_implementation_section: $ => repeat1($.function_implementation),

    type_implementation_section: $ => repeat1($.type_implementation),

    event_implementation_section: $ => prec(200, repeat1($.event_implementation)),

    second_event_implementation_section: $ => repeat1($.event_implementation),

    event_implementation: $ => prec(3, seq(
      $.event_keyword,
      optional(seq($.type_keyword, $.data_type)),
      $.identifier,
      optional($.parameter_list),
      optional($.throws_clause),
      ';',
      repeat($.statement),
      $.end_event_keyword,
    )),

    on_event_block_section: $ => repeat1($.on_event_block),

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
      optional($.variable_precision),
      $.variable_declaration_list,
    ),

    // Declaração sem modificador de acesso (dentro de seções Private:, Protected:, etc.)
    variable_declaration_no_access: $ => seq(
      $.data_type,
      optional($.variable_precision),
      $.variable_declaration_list,
    ),

    // Declaração com modificador de acesso inline
    variable_declaration_with_access: $ => prec(PREC.VARIABLE_DECL_ACCESS, seq(
      $.access_modifier,
      $.data_type,
      optional($.variable_precision),
      $.variable_declaration_list,
    )),

    variable_declaration_list: $ => commaSep1(seq(
      $.identifier,
      optional($.array_suffix),
      optional(seq('=', $.expression)),
    )),

    variable_precision: $ => /\{\d\}/,

    access_modifier: $ => prec(PREC.ACCESS_MODIFIER, choice(
      $.public_keyword,
      $.private_keyword,
      $.protected_keyword,
    )),

    // Function Definitions with Throws Support
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
      optional($.throws_clause),
    ),

    throws_clause: $ => seq(
      caseInsensitive('throws'),
      commaSep1($.identifier),
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
        $.ref_keyword,
        $.readonly_keyword,
      )),
      $.data_type,
      $.identifier,
      optional($.array_suffix),
    ),

    // Event Definitions with Throws Support
    event_declaration: $ => prec(1, seq(
      $.event_keyword,
      optional(seq($.type_keyword, $.data_type)),
      $.identifier,
      optional($.parameter_list),
      optional($.throws_clause),
      optional($.event_id),
    )),

    event_id: $ => /pbm_[a-zA-Z_][a-zA-Z0-9_]*/,

    // Type Members
    type_member: $ => choice(
      $.property_assignment,
      $.event_declaration,
      $.function_implementation,
      $.type_variables_section,
      $.on_event_block,
      $.event_implementation,
      $.nested_type_declaration,
    ),

    nested_type_declaration: $ => seq(
      caseInsensitive('type'),
      $.identifier,
      caseInsensitive('from'),
      $.base_type,
      caseInsensitive('within'),
      $.identifier,
      optional($.descriptor_clause),
      repeat(choice(
        $.property_assignment,
        $.event_declaration,
        $.type_variables_section,
      )),
      caseInsensitive('end'),
      caseInsensitive('type'),
    ),

    type_implementation: $ => seq(
      caseInsensitive('global'),
      $.data_type,
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
      $.throw_statement,
      $.try_catch_statement,
      $.call_statement,
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

    throw_statement: $ => seq(
      caseInsensitive('throw'),
      $.expression,
    ),

    try_catch_statement: $ => seq(
      caseInsensitive('try'),
      repeat($.statement),
      repeat($.catch_clause),
      optional($.finally_clause),
      caseInsensitive('end'),
      caseInsensitive('try'),
    ),

    catch_clause: $ => seq(
      caseInsensitive('catch'),
      '(',
      $.data_type,
      $.identifier,
      ')',
      repeat($.statement),
    ),

    finally_clause: $ => seq(
      caseInsensitive('finally'),
      repeat($.statement),
    ),

    call_statement: $ => choice(
      $.super_call,
      $.trigger_event_call,
    ),

    super_call: $ => prec.right(seq(
      caseInsensitive('call'),
      caseInsensitive('super'),
      '::',
      $.identifier,
      optional($.argument_list),
    )),

    trigger_event_call: $ => seq(
      caseInsensitive('triggerevent'),
      '(',
      $.expression,
      ',',
      $.string_literal,
      optional(seq(',', commaSep($.expression))),
      ')',
    ),

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
      $.create_expression,
      $.destroy_expression,
      $.primary_expression,
    ),

    create_expression: $ => seq(
      caseInsensitive('create'),
      $.identifier,
    ),

    destroy_expression: $ => seq(
      caseInsensitive('destroy'),
      '(',
      $.expression,
      ')',
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
      choice('.', '::'),
      $.identifier,
    )),

    function_call: $ => prec(PREC.CALL, seq(
      $.identifier,
      $.argument_list,
    )),

    argument_list: $ => seq(
      '(',
      commaSep($.expression),
      ')',
    ),

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
      $.this_literal,
    ),

    this_literal: $ => caseInsensitive('this'),

    lvalue: $ => prec(1, choice(
      $.identifier,
      $.member_expression,
      $.array_access,
    )),

    // ========================================
    // BASIC TYPES AND LITERALS
    // ========================================

    data_type: $ => choice(
      caseInsensitive('blob'),
      caseInsensitive('boolean'),
      caseInsensitive('byte'),
      caseInsensitive('char'),
      caseInsensitive('character'),
      caseInsensitive('date'),
      caseInsensitive('datetime'),
      caseInsensitive('decimal'),
      caseInsensitive('dec'),
      caseInsensitive('double'),
      caseInsensitive('integer'),
      caseInsensitive('int'),
      caseInsensitive('longlong'),
      caseInsensitive('long'),
      caseInsensitive('real'),
      caseInsensitive('string'),
      caseInsensitive('time'),
      caseInsensitive('unsignedinteger'),
      caseInsensitive('unsignedint'),
      caseInsensitive('uint'),
      caseInsensitive('unsignedlong'),
      caseInsensitive('ulong'),
      caseInsensitive('any'),
      caseInsensitive('exception'),
      $.custom_data_type,
    ),

    array_suffix: $ => seq('[', ']'),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_\-$#%]*/,

    // Custom data type
    custom_data_type: $ => prec(-10, $.identifier),

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

    // Keywords
    forward_keyword: _ => caseInsensitive('forward'),
    end_keyword: _ => caseInsensitive('end'),
    global_keyword: _ => caseInsensitive('global'),
    type_keyword: _ => caseInsensitive('type'),
    from_keyword: _ => caseInsensitive('from'),
    release_keyword: _ => caseInsensitive('release'),
    within_keyword: _ => caseInsensitive('within'),
    variables_keyword: _ => caseInsensitive('variables'),
    shared_variables_keyword: _ => token(caseInsensitive('shared variables')),
    event_keyword: _ => token(prec(100, caseInsensitive('event'))),
    on_keyword: _ => caseInsensitive('on'),

    public_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('public'))),
    private_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('private'))),
    protected_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('protected'))),

    prototypes_keyword: _ => caseInsensitive('prototypes'),
    function_keyword: _ => caseInsensitive('function'),
    subroutine_keyword: _ => caseInsensitive('subroutine'),
    ref_keyword: $ => token(prec(100, caseInsensitive('ref'))),
    readonly_keyword: $ => token(prec(100, caseInsensitive('readonly'))),
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
    end_type_keyword: _ => token(caseInsensitive('end type')),
    end_variables_keyword: _ => token(caseInsensitive('end variables')),
    end_forward_keyword: _ => token(caseInsensitive('end forward')),
    global_variables_keyword: _ => token(caseInsensitive('global variables')),
    type_variables_keyword: _ => token(caseInsensitive('type variables')),
    end_event_keyword: _ => token(caseInsensitive('end event')),
    structure_keyword: _ => caseInsensitive('structure'),
    tab_char: _ => /\t/,

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
