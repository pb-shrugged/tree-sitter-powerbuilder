/* eslint-disable object-curly-spacing */
/**
 * @file Powerbuilder grammar for tree-sitter
 * @author Jose Cagnini
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  KEYWORD: 60,
  STD_TYPE: 50,
  COMMENT: 0,
  ASSIGNMENT: 1,
  TERNARY: 2,
  OR: 3,
  AND: 4,
  EQUALITY: 5,
  RELATIONAL: 6,
  ADDITIVE: 7,
  MULTIPLICATIVE: 8,
  EXPONENTIATION: 9,
  UNARY: 10,
  UPDATE_UNARY: 11,
  FIELD_ACCESS: 12,
  METHOD_INVOCATION: 13,
  GLOBAL_SCOPE_OPERADOR_VAR: 14,
  GLOBAL_SCOPE_OPERADOR_METHOD: 15,
  CALL: 13,
  PRIMARY: 15,
  VALUE_BY: 16,
  ACCESS_MODIFIER: 17,
  VARIABLE_DECL_ACCESS: 18,
};

module.exports = grammar({
  name: 'powerbuilder',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /[ \t]*/,
    $.line_continuation,
    $._new_line,
  ],

  // @ts-ignore
  reserved: {
    global: $ => {
      return [
        $.public_keyword,
        $.private_keyword,
        $.protected_keyword,
        $.alias_keyword,
        $.and_keyword,
        // $.autoinstantiate_keyword,
        $.call_keyword,
        $.case_keyword,
        $.catch_keyword,
        $.choose_keyword,
        $.close_keyword,
        $.commit_keyword,
        $.connect_keyword,
        $.constant_keyword,
        $.continue_keyword,
        $.create_keyword,
        $.cursor_keyword,
        $.declare_keyword,
        $.delete_keyword,
        $.descriptor_keyword,
        $.describe_keyword,
        $.destroy_keyword,
        $.disconnect_keyword,
        $.do_keyword,
        $.dynamic_keyword,
        $.else_keyword,
        $.elseif_keyword,
        $.end_keyword,
        // $.enumerated_keyword,
        $.event_keyword,
        $.execute_keyword,
        $.exit_keyword,
        // $.external_keyword,
        $.false_keyword,
        $.fetch_keyword,
        $.finally_keyword,
        // $.first_keyword,
        $.for_keyword,
        $.forward_keyword,
        $.from_keyword,
        $.function_keyword,
        $.global_keyword,
        $.goto_keyword,
        $.halt_keyword,
        $.if_keyword,
        $.immediate_keyword,
        // $.indirect_keyword,
        $.insert_keyword,
        $.into_keyword,
        // $.intrinsic_keyword,
        $.is_keyword,
        // $.last_keyword,
        $.library_keyword,
        $.loop_keyword,
        // $.native_keyword,
        $.next_keyword,
        $.not_keyword,
        $.of_keyword,
        $.on_keyword,
        $.open_keyword,
        $.or_keyword,
        $.parent_keyword,
        $.post_keyword,
        $.prepare_keyword,
        // $.prior_keyword,
        $.privateread_keyword,
        $.privatewrite_keyword,
        $.procedure_keyword,
        $.protectedread_keyword,
        $.protectedwrite_keyword,
        $.prototypes_keyword,
        $.readonly_keyword,
        $.ref_keyword,
        $.return_keyword,
        $.rollback_keyword,
        // $.rpcfunc_keyword,
        $.select_keyword,
        $.selectblob_keyword,
        $.shared_keyword,
        $.static_keyword,
        $.step_keyword,
        $.subroutine_keyword,
        $.super_keyword,
        // $.system_keyword,
        // $.systemread_keyword,
        // $.systemwrite_keyword,
        $.then_keyword,
        $.this_keyword,
        $.throw_keyword,
        $.throws_keyword,
        $.to_keyword,
        $.trigger_keyword,
        $.true_keyword,
        $.try_keyword,
        $.type_keyword,
        $.until_keyword,
        $.update_keyword,
        $.updateblob_keyword,
        $.using_keyword,
        $.variables_keyword,
        $.while_keyword,
        // $.with_keyword,
        $.within_keyword,
        // $.debug_keyword
      ];
    },
  },

  rules: {

    // || 1. FILE TYPE ||

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

    // || 1. FILE TYPE END ||

    // || 2. FILE CONTENT STRUCTURE ||

    // Application Content
    application_file_extension: _ => 'sra',

    application_header_file: $ => seq(
      $.export_header_name,
      $.application_file_extension,
      optional($.export_comments),
    ),

    application_content: $ => seq(
      $.forward_section,
      optional($.structure_definition_section),
      optional($.shared_variables_section),
      optional($.global_variables_section),
      $.global_type_definition,
      $.global_var_declaration,
      optional($.external_function_type_prototypes_section),
      optional($.type_variables_section),
      optional($.forward_prototypes_section),
      repeat(choice(
        $.event_implementation,
        $.function_implementation,
        $.on_event_block,
      )),
      repeat($.inner_type_definition),
    ),
    // Application Content End

    // Function Content
    function_file_extension: $ => 'srf',

    function_header_file: $ => seq(
      $.export_header_name,
      $.function_file_extension,
      optional($.export_comments),
    ),

    function_content: $ => seq(
      $.global_type_definition,
      $.global_function_forward_section,
      $.global_function_implementaion_section,
    ),

    global_function_forward_section: $ => seq(
      field('init', $.forward_prototypes_section_init),
      field('body', $.forward_prototypes_global_body),
      field('end', $.prototypes_section_end),
    ),

    forward_prototypes_global_body: $ => repeat1($.global_function_prototype),

    global_function_prototype: $ => choice(
      $.global_function_declaration,
      $.global_subroutine_declaration,
    ),

    global_function_declaration: $ => seq(
      $.global_keyword,
      $.function_keyword,
      $.datatype,
      $.identifier,
      $.parameter_list,
      optional($.throws_clause),
      $._statement_separation,
    ),

    global_subroutine_declaration: $ => seq(
      $.global_keyword,
      $.subroutine_keyword,
      $.identifier,
      $.parameter_list,
      optional($.throws_clause),
      $._statement_separation,
    ),

    global_function_implementaion_section: $ => repeat1($.global_function_implementation),

    global_function_implementation: $ => choice(
      $._global_function_implementation,
      $._global_subroutine_implementation,
    ),

    _global_function_implementation: $ => seq(
      field('init', $.global_function_declaration),
      field('body', optional($.scriptable_block)),
      field('end', $.end_function_implementation),
    ),

    _global_subroutine_implementation: $ => seq(
      field('init', $.global_subroutine_declaration),
      field('body', optional($.scriptable_block)),
      field('end', $.end_subroutine_implementation),
    ),

    // Function Content End

    // Structure Content
    structure_file_extension: _ => 'srs',

    structure_header_file: $ => seq(
      $.export_header_name,
      $.structure_file_extension,
      optional($.export_comments),
    ),

    structure_content: $ => seq(
      $.global_keyword,
      $.structure_definition,
    ),
    // Structure Content End

    // Window Content
    window_file_extension: _ => 'srw',

    window_header_file: $ => seq(
      $.export_header_name,
      $.window_file_extension,
      optional($.export_comments),
    ),

    window_content: $ => seq(
      $.window_type_declaration,
    ),

    window_type_declaration: $ => seq(
      $.forward_section,
      optional($.structure_definition_section),
      optional($.shared_variables_section),
      $.global_type_definition,
      $.global_var_declaration,
      optional($.external_function_type_prototypes_section),
      optional($.type_variables_section),
      optional($.forward_prototypes_section),
      repeat(choice(
        $.event_implementation,
        $.function_implementation,
        $.on_event_block,
      )),
      repeat($.inner_type_definition),
    ),
    // Window Content End


    // Menu Content
    menu_file_extension: _ => 'srm',

    menu_header_file: $ => seq(
      $.export_header_name,
      $.menu_file_extension,
      optional($.export_comments),
    ),

    menu_content: $ => seq(
      $.forward_section,
      optional($.structure_definition_section),
      optional($.shared_variables_section),
      $.global_type_definition,
      $.global_var_declaration,
      optional($.external_function_type_prototypes_section),
      optional($.type_variables_section),
      optional($.forward_prototypes_section),
      repeat(choice(
        $.event_implementation,
        $.function_implementation,
        $.on_event_block,
      )),
      repeat($.inner_type_definition),
    ),

    // Menu Content End


    // User Object Content
    user_object_file_extension: _ => 'sru',

    user_object_header_file: $ => seq(
      $.export_header_name,
      $.user_object_file_extension,
      optional($.export_comments),
    ),

    user_object_content: $ => seq(
      $.forward_section,
      optional($.structure_definition_section),
      optional($.shared_variables_section),
      $.global_type_definition,
      $.global_var_declaration,
      optional($.external_function_type_prototypes_section),
      optional($.type_variables_section),
      optional($.forward_prototypes_section),
      repeat(choice(
        $.event_implementation,
        $.function_implementation,
        $.on_event_block,
      )),
      repeat($.inner_type_definition),
    ),

    // User Object Content End


    // Query Content
    query_file_extension: _ => 'srq',

    query_header_file: $ => seq(
      $.export_header_name,
      $.query_file_extension,
      optional($.export_comments),
    ),

    query_content: $ => $.identifier,
    // Query Content End


    // || 2. FILE CONTENT STRUCTURE END ||


    // || 3. COMMON CONSTRUCT ||

    export_header_name: $ => seq(
      /HA\$PBExportHeader\$/,
      field('file_name', $.identifier),
      /\./,
    ),

    export_comments: $ => seq(
      /\$PBExportComments\$/,
      field('comment', seq($._rest_of_line, $._new_line)),
    ),

    global_variables_section: $ => seq(
      field('init', $.global_variables_section_init),
      field('body', optional($.global_variables_section_body)),
      field('end', $.end_variables_section),
    ),

    global_variables_section_init: $ => seq(
      $.global_keyword,
      $.variables_keyword,
    ),

    global_variables_section_body: $ => repeat1($.local_variable_declaration),

    shared_variables_section: $ => seq(
      field('init', $.shared_variables_section_init),
      field('body', optional($.shared_variables_section_body)),
      field('end', $.end_variables_section),
    ),

    shared_variables_section_init: $ => seq(
      $.shared_keyword,
      $.variables_keyword,
    ),

    shared_variables_section_body: $ => repeat1($.local_variable_declaration),

    type_variables_section: $ => seq(
      field('init', $.type_variables_section_init),
      field('body', optional($.type_variables_section_body)),
      field('end', $.end_variables_section),
    ),

    type_variables_section_init: $ => seq(
      $.type_keyword,
      $.variables_keyword,
    ),

    type_variables_section_body: $ => repeat1($.class_variable_declaration),

    structure_definition_section: $ => repeat1(
      $.structure_definition,
    ),

    structure_definition: $ => seq(
      field('init', $.structure_definition_init),
      field('body', $.structure_definition_body),
      field('end', $.end_type_section),
    ),

    structure_definition_init: $ => seq(
      $.type_keyword,
      $.identifier,
      $.from_keyword,
      field('structure', 'structure'),
    ),

    structure_definition_body: $ => repeat1($.structure_field),

    structure_field: $ => seq(
      $.datatype,
      $.structure_field_separator,
      $.identifier,
      optional($.array_suffix),
    ),

    structure_field_separator: $ => /\t\t/,

    function_prototype: $ => choice(
      $.function_declaration,
      $.subroutine_declaration,
    ),

    function_declaration: $ => seq(
      optional($.access_modifier),
      $.function_keyword,
      $.datatype,
      field('name', $.identifier),
      $.parameter_list,
      optional($.throws_clause),
    ),

    subroutine_declaration: $ => seq(
      optional($.access_modifier),
      $.subroutine_keyword,
      field('name', $.identifier),
      $.parameter_list,
      optional($.throws_clause),
    ),

    function_implementation: $ => choice(
      $._function_implementantion,
      $._subroutine_implementation,
    ),

    _function_implementantion: $ => seq(
      field('init', seq($.function_declaration, $._statement_separation)),
      field('body', optional($.scriptable_block)),
      field('end', $.end_function_implementation),
    ),

    _subroutine_implementation: $ => seq(
      field('init', seq($.subroutine_declaration, $._statement_separation)),
      field('body', optional($.scriptable_block)),
      field('end', $.end_subroutine_implementation),
    ),

    throws_clause: $ => seq(
      $.throws_keyword,
      commaSep1($.identifier),
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
      $.datatype,
      $.identifier,
      optional($.array_suffix),
    ),

    event_declaration: $ => prec(10, seq(
      $.event_keyword,
      optional(seq($.type_keyword, $.datatype)),
      $.identifier,
      optional($.parameter_list),
      optional($.throws_clause),
      optional($.event_id),
    )),

    event_implementation: $ => seq(
      field('init', $.event_implementation_init),
      field('body', optional($.scriptable_block)),
      field('end', $.end_event_implementation),
    ),

    event_implementation_init: $ => seq(
      $.event_keyword,
      optional(seq($.type_keyword, $.datatype)),
      $.identifier,
      optional($.parameter_list),
      optional($.throws_clause),
      $._statement_separation,
    ),

    on_event_block: $ => prec(100, seq(
      field('init', $.on_event_block_init),
      field('body', optional($.scriptable_block)),
      field('end', $.on_event_block_end),
    )),

    on_event_block_init: $ => seq($.on_keyword, field('class_name', $.identifier), '.', field('event_name', choice($.create_keyword, $.destroy_keyword))),

    on_event_block_end: $ => seq($.end_keyword, $.on_keyword),

    event_id: $ => /pbm_[a-zA-Z_][a-zA-Z0-9_]*/,

    external_function_type_prototypes_section: $ => seq(
      field('init', $.external_function_type_prototypes_section_init),
      field('body', repeat($.external_function_declaration)),
      field('end', $.prototypes_section_end),
    ),

    external_function_type_prototypes_section_init: $ => seq(
      $.type_keyword,
      $.prototypes_keyword,
    ),

    external_function_declaration: $ => seq(
      $.function_prototype,
      $.library_keyword,
      field('library_name', $.string_literal),
      optional(seq(
        $.alias_keyword,
        $.for_keyword,
        field('alias_name', $.string_literal),
      )),
    ),

    forward_section: $ => seq(
      field('init', $.forward_keyword),
      field('body', $.forward_section_body),
      field('end', $.end_forward_section),
    ),

    end_forward_section: $ => seq(
      $.end_keyword,
      $.forward_keyword,
    ),

    forward_section_body: $ => seq(
      $.global_type_declaration,
      repeat($.inner_object_type_declaration),
      repeat($.global_variable_declaration), // Only in application files
      repeat($.global_type_definition),
    ),

    global_type_declaration: $ => seq(
      $.global_keyword,
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.class_datatype,
      $.end_type_section,
    ),

    inner_object_type_declaration: $ => seq(
      field('init', $.inner_object_type_declaration_init),
      field('body', optional($.inner_object_type_declaration_body)),
      field('end', $.end_type_section),
    ),

    inner_object_type_declaration_body: $ => repeat1(choice(
      $.inner_object_var_declaration,
    )),

    inner_object_type_declaration_init: $ => seq(
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.class_datatype,
      $.within_keyword,
      field('parent_class', $.identifier),
    ),

    global_variable_declaration: $ => seq(
      $.global_keyword,
      $.datatype,
      field('var_name', $.identifier),
    ),

    scriptable_block: $ => repeat1($.statement),

    end_subroutine_implementation: $ => seq(
      $.end_keyword,
      $.subroutine_keyword,
    ),

    end_function_implementation: $ => seq(
      $.end_keyword,
      $.function_keyword,
    ),

    end_type_section: $ => seq(
      $.end_keyword,
      $.type_keyword,
    ),

    end_variables_section: $ => seq(
      $.end_keyword,
      $.variables_keyword,
    ),

    end_event_implementation: $ => seq(
      $.end_keyword,
      $.event_keyword,
    ),

    type_definition: $ => seq(
      field('init', $.type_declaration_init),
      field('body', optional($.type_definition_body)),
      field('end', $.end_type_section),
    ),

    type_declaration_init: $ => seq(
      $.type_keyword,
      field('type_name', $.identifier),
      $.from_keyword,
      $.class_datatype,
      optional(seq(
        $.within_keyword,
        field('parent_class', $.identifier),
        optional(seq(
          $.descriptor_keyword,
          $.string_literal,
          '=',
          $.string_literal,
        )),
      )),
    ),

    type_definition_body: $ => repeat1(choice(
      $.event_declaration,
      $.inner_object_var_declaration,
    )),

    type_declaration: $ => seq(
      field('init', $.type_declaration_init),
      field('end', $.end_type_section),
    ),

    global_type_definition: $ => seq(
      field('init', $.global_type_declaration_init),
      field('body', optional($.type_definition_body)),
      field('end', $.end_type_section),
    ),

    global_type_declaration_init: $ => seq(
      $.global_keyword,
      $.type_declaration_init,
    ),

    global_var_declaration: $ => seq(
      caseInsensitive('global'),
      $.datatype,
      $.identifier,
    ),

    inner_object_var_declaration: $ => $.local_variable_declaration,

    // Function Definitions with Throws Support
    forward_prototypes_section: $ => seq(
      field('init', $.forward_prototypes_section_init),
      field('body', repeat($.function_prototype)),
      field('end', $.prototypes_section_end),
    ),

    forward_prototypes_section_init: $ => seq(
      $.forward_keyword,
      $.prototypes_keyword,
    ),

    prototypes_section_end: $ => seq(
      $.end_keyword,
      $.prototypes_keyword,
    ),

    class_variable_declaration: $ => choice(
      $.block_class_variable_declaration,
      $.inline_class_variable_declaration,
    ),

    inline_class_variable_declaration: $ => seq(
      // optional($.constant_keyword), TODO
      optional($.access_modifier),
      optional($.readacess_modifier),
      optional($.writeaccess_modifier),
      $.local_variable_declaration,
    ),

    block_class_variable_declaration: $ => prec(500, seq(
      $.access_section,
      repeat1($.inline_class_variable_declaration),
    )),

    variable_declaration_list: $ => commaSep1($.variable_declaration_identifier),

    variable_declaration_identifier: $ => seq(
      field('var_name', $.identifier),
      optional($.array_suffix),
      optional(seq('=', $.expression)),
    ),

    variable_precision: $ => /\{\d\}/,

    array_suffix: $ => seq(
      '[',
      field('array_range', choice(
        commaSep($.integer_literal),
        commaSep(seq($.integer_literal, $.to_keyword, $.integer_literal)),
      )),
      ']',
    ),

    array_suffix_ref: _ => /\[[ \t]*\]/,

    access_section: $ => seq(
      $.access_modifier,
      ':',
      $._statement_separation,
    ),

    access_modifier: $ => choice(
      $.public_keyword,
      $.private_keyword,
      $.protected_keyword,
    ),

    readacess_modifier: $ => choice(
      $.protectedread_keyword,
      $.privateread_keyword,
    ),

    writeaccess_modifier: $ => choice(
      $.protectedwrite_keyword,
      $.privatewrite_keyword,
    ),

    inner_type_declaration: $ => $.type_declaration,

    inner_type_definition: $ => seq(
      $.type_definition,
      repeat(choice(
        $.event_implementation,
        $.on_event_block,
      )),
    ),

    // || 3. COMMON CONSTRUCT END ||

    // || 4. EXPRESSION AND STATEMENT ||

    statement: $ => choice(
      $._local_variable_declaration_statement,
      seq($.inline_statement, $._statement_separation),
      $.choose_statement,
      $.loop_statement,
      $.goto_label,
      $._if_statement,
      $.throw_statement,
      $.try_catch_statement,
      $.sql_statement,
    ),

    inline_statement: $ => choice(
      $.assignment_statement,
      $.call_statement,
      $.continue_statement,
      $.create_statement,
      $.destroy_statement,
      $.exit_statement,
      $.goto_statement,
      $.halt_statement,
      $.return_statement,
      $.throw_statement,
      $.expression_statement,
    ),

    _local_variable_declaration_statement: $ => prec(100, $.local_variable_declaration),

    local_variable_declaration: $ => seq(
      optional($.constant_keyword),
      $.datatype,
      optional($.variable_precision),
      $.variable_declaration_list,
      $._statement_separation,
    ),

    assignment_statement: $ => prec(PREC.ASSIGNMENT, seq(
      field('left', choice($.identifier, $.field_access, $.array_access)),
      field('operator', $.assignment_operator),
      field('right', $.expression),
    )),

    assignment_operator: $ => choice('=', '+=', '-=', '*=', '/=', '^/'),

    call_statement: $ => seq(
      $.call_keyword,
      field('ancestor', choice($.identifier, $.super_keyword)),
      field('control', optional(seq('`', $.identifier))),
      '::',
      field('event_name', $.identifier),
    ),

    choose_statement: $ => seq(
      $.choose_keyword,
      $.case_keyword,
      field('test_expression', $.expression),
      $._statement_separation,
      field(
        'case_condition',
        seq(
          repeat1($.case_clause),
          optional($.case_else_clause),
        ),
      ),
      $.end_keyword,
      $.choose_keyword,
      $._statement_separation,
    ),

    case_clause: $ => seq(
      $.case_keyword,
      field('condition', choice(
        commaSep($.expression),
        seq($.expression, $.to_keyword, $.expression),
        seq($.is_keyword, choice('>', '<', '>=', '<='), $.expression),
      )),
      $._statement_separation,
      field('block', optional($.scriptable_block)),
    ),

    case_else_clause: $ => seq(
      $.case_keyword,
      $.else_keyword,
      $._statement_separation,
      field('block', optional($.scriptable_block)),
    ),

    continue_statement: $ => $.continue_keyword,

    create_statement: $ => choice(
      seq(
        field('var_name', choice($.field_access, $.identifier)),
        field('assignment_operator', '='),
        $.create_keyword,
        field('datatype', $.datatype),
      ),
      seq(
        field('var_name', $.identifier),
        field('assignment_operator', '='),
        $.create_keyword,
        $.using_keyword,
        field('type_string_literal', $.string_literal),
      ),
    ),

    destroy_statement: $ => prec(100, choice(
      seq($.destroy_keyword, '(', field('var_name', choice($.field_access, $.identifier)), ')'),
      seq($.destroy_keyword, field('var_name', choice($.field_access, $.identifier))),
    )),

    loop_statement: $ => choice(
      $.while_loop,
      $.do_loop,
      $.for_loop,
    ),

    while_loop: $ => seq(
      $.do_keyword,
      choice($.until_keyword, $.while_keyword),
      field('condition', $.expression),
      $._statement_separation,
      field('block', optional($.scriptable_block)),
      $.loop_keyword,
      $._statement_separation,
    ),

    do_loop: $ => seq(
      $.do_keyword,
      $._statement_separation,
      field('block', optional($.scriptable_block)),
      $.loop_keyword,
      choice($.until_keyword, $.while_keyword),
      field('condition', $.expression),
      $._statement_separation,
    ),

    for_loop: $ => seq(
      $.for_keyword,
      field('iteration_counter', $.identifier),
      '=',
      field('initial_value', $.expression),
      $.to_keyword,
      field('final_value', $.expression),
      optional(seq($.step_keyword, field('increment_value', $.expression))),
      $._statement_separation,
      field('block', optional($.scriptable_block)),
      $.next_keyword,
      $._statement_separation,
    ),

    exit_statement: $ => $.exit_keyword,

    goto_statement: $ => seq($.goto_keyword, field('label', $.identifier)),

    goto_label: $ => seq(field('label', $.identifier), ':', $._statement_separation),

    halt_statement: $ => seq($.halt_keyword, optional($.close_keyword)),

    _if_statement: $ => choice(
      $.if_statement,
      $.inline_if_statement,
    ),

    if_statement: $ => seq(
      $.if_keyword,
      field('if_condition', $.expression),
      $.then_keyword,
      $._statement_separation,
      field('if_block', optional($.scriptable_block)),
      field('elseif_clause', repeat($.elseif_clause)),
      field('else_clause', optional($.else_clause)),
      $.end_keyword,
      $.if_keyword,
      $._statement_separation,
    ),

    inline_if_statement: $ => prec.left(seq(
      $.if_keyword,
      field('if_condition', $.expression),
      $.then_keyword,
      field('inline_if_statement', $.inline_statement),
      optional(seq($.else_keyword, field('inline_else_statement', $.inline_statement))),
      $._statement_separation,
    )),

    elseif_clause: $ => seq(
      $.elseif_keyword,
      field('elseif_condition', $.expression),
      $.then_keyword,
      $._statement_separation,
      field('elseif_block', optional($.scriptable_block)),
    ),

    else_clause: $ => seq(
      $.else_keyword,
      $._statement_separation,
      field('else_block', optional($.scriptable_block)),
    ),

    return_statement: $ => prec.left(seq(
      $.return_keyword,
      field('return_value', optional($.expression)),
    )),

    throw_statement: $ => seq(
      $.throw_keyword,
      choice(
        seq($.create_keyword, $.datatype),
        $.expression,
      ),
    ),

    try_catch_statement: $ => seq(
      $.try_keyword,
      $._statement_separation,
      field('try_block', optional($.scriptable_block)),
      repeat($.catch_clause),
      optional($.finally_clause),
      $.end_keyword,
      $.try_keyword,
      $._statement_separation,
    ),

    catch_clause: $ => seq(
      $.catch_keyword,
      '(',
      field('throwable_type', $.datatype),
      field('throwable_name', $.identifier),
      ')',
      $._statement_separation,
      field('catch_block', optional($.scriptable_block)),
    ),

    finally_clause: $ => seq(
      $.finally_keyword,
      $._statement_separation,
      field('finally_block', optional($.scriptable_block)),
    ),

    sql_statement: $ => choice(
      $.close_cursor_procedure_statement,
      $.commit_statement,
      $.connect_statement,
      $.declare_cursor_statement,
      $.declare_procedure_statement,
      $.declare_dynamic_statement,
      $.describe_sql_statement,
      $.delete_statement,
      $.disconnect_statement,
      $.execute_statement,
      $.fetch_statement,
      $.insert_statement,
      $.open_cursor_statement,
      $.rollback_statement,
      $.select_statement,
      $.update_statement,
      $.prepare_sql_statement,
    ),

    close_cursor_procedure_statement: $ => seq(
      $.close_keyword,
      field('cursor_procedure_name', $.identifier),
      ';',
    ),

    using_transaction_statement: $ => seq(
      $.using_keyword,
      field('transaction_name', $.identifier),
    ),

    commit_statement: $ => seq(
      $.commit_keyword,
      optional($.using_transaction_statement),
      ';',
    ),

    connect_statement: $ => seq(
      $.connect_keyword,
      optional($.using_transaction_statement),
      ';',
    ),

    declare_cursor_statement: $ => seq(
      $.declare_keyword,
      field('cursor_name', $.identifier),
      $.cursor_keyword,
      $.for_keyword,
      $.select_statement,
      // optional($.using_transaction_statement),
      // ';',
    ),

    declare_procedure_statement: $ => seq(
      $.declare_keyword,
      field('procedure_name', $.identifier),
      $.procedure_keyword,
      $.for_keyword,
      field('store_procedure_name', $.identifier),
      optional($.stored_procedure_param_list),
      optional($.using_transaction_statement),
      ';',
    ),

    declare_dynamic_statement: $ => seq(
      $.declare_keyword,
      field('cursor_procedure_name', $.identifier),
      $.dynamic_keyword,
      choice($.cursor_keyword, $.procedure_keyword),
      $.for_keyword,
      field('dynamic_stage_area', $.identifier),
      ';',
    ),

    describe_sql_statement: $ => seq(
      $.describe_keyword,
      field('dynamic_stage_area', $.identifier),
      $.into_keyword,
      field('dynamic_description_area', $.identifier),
      ';',
    ),

    stored_procedure_param_list: $ => choice(
      commaSep1($.stored_procedure_param_ase),
      seq('(', commaSep1($.stored_procedure_param_oracle), ')'),
    ),

    stored_procedure_param_ase: $ => seq(
      '@',
      field('param_name', $.identifier),
      '=',
      optional(':'),
      field('var_name', $.expression),
    ),

    stored_procedure_param_oracle: $ => seq(
      optional(':'),
      field('var_name', $.expression),
    ),

    delete_statement: $ => choice(
      seq(
        $.delete_keyword,
        $.from_keyword,
        field('table_name', $.identifier),
        $.where_keyword,
        $.where_criteria,
        $.rest_of_sql,
        // optional($.using_transaction_statement),
        ';',
      ),
      seq(
        $.delete_keyword,
        $.from_keyword,
        field('table_name', $.identifier),
        $.where_keyword,
        $.current_keyword,
        $.of_keyword,
        field('cursor_name', $.identifier),
        ';',
      ),
    ),

    disconnect_statement: $ => seq(
      $.disconnect_keyword,
      optional($.using_transaction_statement),
      ';',
    ),

    execute_statement: $ => choice(
      seq($.execute_keyword, field('procedure_name', $.identifier), ';'),
      seq($.execute_keyword, $.immediate_keyword, $.select_statement),
      seq($.execute_keyword, field('dynamic_stage_area', $.identifier), seq($.using_keyword, commaSep1($.stored_procedure_param_oracle)), ';'),
      seq($.execute_keyword, $.dynamic_keyword, field('procedure_name', $.identifier), optional(seq($.using_keyword, commaSep1($.stored_procedure_param_oracle))), ';'),
      seq($.execute_keyword, $.dynamic_keyword, field('procedure_name', $.identifier), $.using_keyword, $.descriptor_keyword, field('dynamic_description_area', $.identifier), ';'),
    ),

    fetch_statement: $ => choice(
      seq(
        $.fetch_keyword,
        field('cursor_procedure_name', $.identifier),
        $.into_keyword,
        $.fetch_variable_list,
        ';',
      ),
      seq(
        $.fetch_keyword,
        field('cursor_procedure_name', $.identifier),
        $.using_keyword,
        $.descriptor_keyword,
        field('dynamic_stage_area', $.identifier),
        ';',
      ),
    ),

    fetch_variable_list: $ => commaSep1(seq(':', field('var_name', $.identifier), optional(seq(':', field('indicator_var', $.identifier))))),

    insert_statement: $ => seq(
      $.insert_keyword,
      $.rest_of_sql,
      // optional($.using_transaction_statement),
      ';',
    ),

    open_cursor_statement: $ => choice(
      seq(
        $.open_keyword,
        field('cursor_name', $.identifier),
        ';',
      ),
      seq(
        $.open_keyword,
        $.dynamic_keyword,
        field('cursor_name', $.identifier),
        $.using_keyword,
        commaSep1($.stored_procedure_param_oracle),
        ';',
      ),
      seq(
        $.open_keyword,
        $.dynamic_keyword,
        field('cursor_name', $.identifier),
        $.using_keyword,
        $.descriptor_keyword,
        field('dynamic_staging_area', $.identifier),
        ';',
      ),
    ),

    rollback_statement: $ => seq(
      $.rollback_keyword,
      optional($.using_transaction_statement),
      ';',
    ),

    select_statement: $ => seq(
      choice($.select_keyword, $.selectblob_keyword),
      $.rest_of_sql,
      ';',
    ),

    update_statement: $ => seq(
      choice($.update_keyword, $.updateblob_keyword),
      field('table_name', $.identifier),
      $.rest_of_sql,
      // optional($.using_transaction_statement),
      ';',
    ),

    prepare_sql_statement: $ => seq(
      $.prepare_keyword,
      field('dynamic_staging_area', $.identifier),
      $.from_keyword,
      choice(
        $.string_literal,
        seq(':', $.expression),
      ),
      ';',
    ),

    rest_of_sql: $ => token(/[^;]*/),

    where_criteria: $ => $.rest_of_sql,

    expression_statement: $ => prec(100, seq(
      choice(
        $.update_expression,
        $.method_invocation,
      ),
    )),

    // Expressions
    expression: $ => choice(
      $.update_expression,
      $.binary_expression,
      $.unary_expression,
      $.primary_expression,
    ),

    update_expression: $ => {
      const argument = field('argument', choice($.field_access, $.identifier_expression));
      const operator = field('operator', choice('--', '++'));
      return prec.right(PREC.UPDATE_UNARY,
        seq(argument, operator),
      );
    },

    binary_expression: $ => {
      const table = [
        { operator: '+', precedence: PREC.ADDITIVE },
        { operator: '-', precedence: PREC.ADDITIVE },
        { operator: '*', precedence: PREC.MULTIPLICATIVE },
        { operator: '/', precedence: PREC.MULTIPLICATIVE },
        { operator: '^', precedence: PREC.EXPONENTIATION },
        { operator: $.or_keyword, precedence: PREC.OR },
        { operator: $.and_keyword, precedence: PREC.AND },
        { operator: '=', precedence: PREC.EQUALITY },
        { operator: '<>', precedence: PREC.EQUALITY },
        { operator: '>', precedence: PREC.RELATIONAL },
        { operator: '<', precedence: PREC.RELATIONAL },
        { operator: '>=', precedence: PREC.RELATIONAL },
        { operator: '<=', precedence: PREC.RELATIONAL },
      ];

      return choice(...table.map(({ operator, precedence }) => {
        return prec.left(precedence, seq(
          field('left', $.expression),
          field('operator', operator),
          field('right', $.expression),
        ));
      }));
    },

    unary_expression: $ => prec.left(PREC.UNARY, seq(
      field('operator', choice($.not_keyword, '-', '+')),
      field('argument', $.expression),
    )),

    primary_expression: $ => prec.left(choice(
      $.identifier_expression,
      $.enumetation_datatype,
      // $.global_scope_var,
      // $.global_scope_method,
      $._literal,
      $.this_literal,
      $.array_literal,
      $.parent_keyword,
      $.parenthesized_expression,
      $.array_access,
      $.field_access,
      $.method_invocation,
    )),

    identifier_expression: $ => prec(-10, seq($.identifier, optional($.array_suffix_ref))),

    // global_scope_var: $ => prec(PREC.GLOBAL_SCOPE_OPERADOR_VAR, seq('::', field('var_name', $.identifier))),
    // global_scope_method: $ => prec(PREC.GLOBAL_SCOPE_OPERADOR_METHOD, seq('::', field('method_name', $.identifier), $.argument_list)),

    parenthesized_expression: $ => seq('(', $.expression, ')'),

    array_access: $ => seq($.primary_expression, '[', $.expression, ']'),

    field_access: $ => prec(PREC.FIELD_ACCESS, seq(
      field('object', choice($.primary_expression, $.super_keyword)),
      field('operator', '.'),
      field('field', seq($.identifier, optional($.array_suffix_ref))),
    )),

    method_invocation: $ => prec(PREC.METHOD_INVOCATION, seq(
      field('object', optional(choice($.primary_expression, $.super_keyword))),
      field('operator', optional(choice('.', '::'))),
      field('method_type', optional(choice($.function_keyword, $.event_keyword))),
      field('call_type', optional(choice($.static_keyword, $.dynamic_keyword))),
      field('when_type', optional(choice($.trigger_keyword, $.post_keyword))),
      field('method_name', $.identifier),
      field('arguments', $.argument_list),
    )),

    argument_list: $ => seq(
      '(',
      commaSep(seq(optional($.ref_keyword), $.expression)),
      ')',
    ),

    // || 4. EXPRESSION AND STATEMENT END ||

    // || 5. DATATYPE AND LITERAL ||

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_\-$#%]*/,

    standard_primitive_datatype: $ => choice(
      token(prec(PREC.STD_TYPE, caseInsensitive('blob'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('boolean'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('byte'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('char'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('character'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('date'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('datetime'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('decimal'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('dec'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('double'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('integer'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('int'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('longlong'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('long'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('real'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('string'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('time'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('unsignedinteger'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('unsignedint'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('uint'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('unsignedlong'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('ulong'))),
      token(prec(PREC.STD_TYPE, caseInsensitive('any'))),
    ),

    standard_class_datatype: $ => choice(
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
    ),

    custom_datatype: $ => $.identifier,

    enumetation_datatype: $ => seq($.identifier, '!'),

    datatype: $ => choice(
      $.standard_primitive_datatype,
      $.standard_class_datatype,
      $.custom_datatype,
    ),

    class_datatype: $ => choice(
      $.standard_class_datatype,
      $.custom_datatype,
    ),

    _literal: $ => choice(
      $.number_literal,
      $.string_literal,
      $.date_literal,
      $.time_literal,
      $.boolean_literal,
    ),

    number_literal: $ => choice(
      $.integer_literal,
      $.decimal_literal,
      $.real_literal,
    ),
    integer_literal: _ => /\d+/,
    decimal_literal: _ => /\d*\.\d+/,
    real_literal: _ => /(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)[Ee][+-]?[0-9]+/,

    date_literal: _ => /(?:\d{4}-\d{2}-\d{2})/,
    time_literal: $ => /(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,6})?/,

    string_literal: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./, /~"/ )), '"'),
      seq('\'', repeat(choice(/[^'\\]/, /\\./, /~'/ )), '\''),
    ),

    boolean_literal: $ => choice(
      $.true_keyword,
      $.false_keyword,
    ),

    null_literal: _ => caseInsensitive('null'),

    this_literal: $ => $.this_keyword,

    array_literal: $ => seq(
      '{',
      commaSep1($.expression),
      '}',
    ),

    // || 5. DATATYPE AND LITERAL END ||

    // || 6. KEYWORD ||

    public_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('public'))),
    private_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('private'))),
    protected_keyword: _ => token(prec(PREC.ACCESS_MODIFIER, caseInsensitive('protected'))),

    alias_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('alias'))),
    and_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('and'))),
    autoinstantiate_keyword: $ => token(prec(PREC.KEYWORD, caseInsensitive('autoinstantiate'))),
    call_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('call'))),
    case_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('case'))),
    catch_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('catch'))),
    choose_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('choose'))),
    close_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('close'))),
    commit_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('commit'))),
    connect_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('connect'))),
    constant_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('constant'))),
    continue_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('continue'))),
    create_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('create'))),
    cursor_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('cursor'))),
    declare_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('declare'))),
    delete_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('delete'))),
    describe_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('describe'))),
    descriptor_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('descriptor'))),
    destroy_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('destroy'))),
    disconnect_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('disconnect'))),
    do_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('do'))),
    dynamic_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('dynamic'))),
    else_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('else'))),
    elseif_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('elseif'))),
    end_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('end'))),
    enumerated_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('enumerated'))),
    event_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('event'))),
    execute_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('execute'))),
    exit_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('exit'))),
    external_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('external'))),
    false_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('false'))),
    fetch_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('fetch'))),
    finally_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('finally'))),
    first_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('first'))),
    for_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('for'))),
    forward_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('forward'))),
    from_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('from'))),
    function_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('function'))),
    global_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('global'))),
    goto_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('goto'))),
    halt_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('halt'))),
    if_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('if'))),
    immediate_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('immediate'))),
    indirect_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('indirect'))),
    insert_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('insert'))),
    into_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('into'))),
    intrinsic_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('intrinsic'))),
    is_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('is'))),
    last_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('last'))),
    library_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('library'))),
    loop_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('loop'))),
    native_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('native'))),
    next_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('next'))),
    not_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('not'))),
    of_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('of'))),
    on_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('on'))),
    open_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('open'))),
    or_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('or'))),
    parent_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('parent'))),
    post_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('post'))),
    prepare_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('prepare'))),
    prior_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('prior'))),
    privateread_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('privateread'))),
    privatewrite_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('privatewrite'))),
    procedure_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('procedure'))),
    protectedread_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('protectedread'))),
    protectedwrite_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('protectedwrite'))),
    prototypes_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('prototypes'))),
    readonly_keyword: $ => token(prec(PREC.KEYWORD, caseInsensitive('readonly'))),
    ref_keyword: $ => token(prec(PREC.KEYWORD, caseInsensitive('ref'))),
    return_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('return'))),
    rollback_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('rollback'))),
    rpcfunc_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('rpcfunc'))),
    select_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('select'))),
    selectblob_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('selectblob'))),
    shared_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('shared'))),
    static_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('static'))),
    step_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('step'))),
    subroutine_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('subroutine'))),
    super_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('super'))),
    system_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('system'))),
    systemread_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('systemread'))),
    systemwrite_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('systemwrite'))),
    then_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('then'))),
    this_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('this'))),
    throw_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('throw'))),
    throws_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('throws'))),
    to_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('to'))),
    trigger_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('trigger'))),
    true_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('true'))),
    try_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('try'))),
    type_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('type'))),
    until_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('until'))),
    update_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('update'))),
    updateblob_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('updateblob'))),
    using_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('using'))),
    variables_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('variables'))),
    while_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('while'))),
    with_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('with'))),
    within_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('within'))),
    debug_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('_debug'))),

    where_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('where'))),
    current_keyword: _ => token(prec(PREC.KEYWORD, caseInsensitive('current'))),


    // || 6. KEYWORD END ||

    // || 7. SPECIAL ||

    line_comment: _ => seq('//', /.*/),
    block_comment: _ => seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),

    line_continuation: _ => /&[ \t]*\r?\n/,
    _statement_separation: $ => choice(';', $._new_line),
    _new_line: _ => /\r?\n/,
    _rest_of_line: _ => /[^\r\n]*/,
    _tab_char: _ => /\t/,

    // || 7. SPECIAL END ||


    // || 99. DATAWINDOW SYNTAX ||

    // Datawindow Content
    datawindow_file_extension: _ => 'srd',

    datawindow_header_file: $ => seq(
      $.export_header_name,
      $.datawindow_file_extension,
      optional($.export_comments),
    ),

    datawindow_content: $ => seq(
      $.release_statement,
      $.datawindow_definition,
    ),

    // Datawindow Definitions
    release_statement: $ => seq(
      caseInsensitive('release'),
      field('release_version', $.number_literal),
      ';',
    ),

    datawindow_definition: $ => repeat1($.datawindow_statement),

    datawindow_statement: $ => $.datawindow_method_invocation,

    datawindow_method_invocation: $ => prec(100, seq(
      field('object', optional(seq(choice($.datawindow_method_invocation, $.datawindow_field_access, $.identifier), '.'))),
      field('method', $.identifier),
      '(',
      optional($.datawindow_property_list),
      ')',
    )),

    datawindow_field_access: $ => seq(
      field('object', choice($.datawindow_method_invocation, $.datawindow_field_access, $.identifier)),
      '.',
      field('method', $.identifier),
    ),

    datawindow_property_list: $ => repeat1($.datawindow_property_assignment),

    datawindow_property_assignment: $ => prec.right(seq(
      field('property', choice($.identifier, $.field_access)),
      '=',
      field('value', choice(
        $._literal,
        seq($.identifier, optional(seq('(', $._literal, ')'))),
        $.datawindow_property_assignment_list,
      )),
    )),

    datawindow_property_assignment_list: $ => prec(100, seq('(', $.datawindow_property_list, ')')),

    // || 99. DATAWINDOW SYNTAX END ||

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
