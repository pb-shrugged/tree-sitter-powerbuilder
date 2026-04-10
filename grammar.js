/* eslint-disable object-curly-spacing */
/**
 * @file Powerbuilder grammar for tree-sitter
 * @author Jose Cagnini
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  UPDATE_UNARY: 1,
}

module.exports = grammar({
  name: "powerscript",

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
    $.line_continuation,
  ],

  rules: {

    source_file: $ => seq(
      optional("HA"),
      optional($.export_header),
      choice(
        $.class_file,
        $.structure_file,
        $.function_file,
      ),
    ),

    class_file: $ => seq(
      $.forward_declaration_section,
      repeat($.structure_definition),
      optional($.shared_variables_section),
      optional($.global_variables_section),
      $.class_type_definition,
      optional($.global_var_declaration),
      optional($.external_function_prototypes),
      optional($.instance_variables_section),
      optional($.forward_function_prototypes),
      repeat(choice(
        $.event_definition,
        $.function_definition,
        $.on_event_definition,
      )),
      repeat($.inner_class_type_definition),
    ),

    forward_declaration_section: $ => seq(
      alias($.forward_keyword, $.forward_declaration_statement),
      $.forward_declaration_statement_body,
      $.forward_declaration_statement_end,
    ),

    forward_declaration_statement_body: $ => seq(
      repeat1($.class_type_definition),
      repeat($.global_variable_declaration),
    ),

    class_type_definition: $ => seq(
      $.class_type_definition_statement,
      optional($.class_type_definition_statement_body),
      $.end_type_declaration_statement,
    ),

    class_type_definition_statement: $ => seq(
      optional($.global_keyword),
      $.type_keyword,
      alias($.identifier, $.class_type_name),
      $.from_keyword,
      alias($.identifier, $.ancenstor_type_name),
      optional($.autoinstantiate_keyword),
      optional(seq(
        $.within_keyword,
        alias($.identifier, $.parent_class),
        optional(seq(
          $.descriptor_keyword,
          alias($.string_literal, $.descriptor_type),
          "=",
          alias($.string_literal, $.descriptor_value),
        )),
      )),
    ),

    class_type_definition_statement_body: $ => repeat1(choice(
      $.event_declaration,
      alias($.local_variable_declaration, $.inner_class_variable_declaration),
    )),

    global_variable_declaration: $ => seq(
      $.global_keyword,
      $.type,
      alias($.identifier, $.variable_name),
    ),

    forward_declaration_statement_end: $ => seq(
      $.end_keyword,
      $.forward_keyword,
    ),

    shared_variables_section: $ => seq(
      $.shared_variables_section_statement,
      optional($.shared_variables_section_body),
      $.end_variables_section,
    ),

    shared_variables_section_statement: $ => seq(
      $.shared_keyword,
      $.variables_keyword,
    ),

    shared_variables_section_body: $ => repeat1($.local_variable_declaration),

    end_variables_section: $ => seq(
      $.end_keyword,
      $.variables_keyword,
    ),

    global_variables_section: $ => seq(
      $.global_variables_section_statement,
      optional($.global_variables_section_body),
      $.end_variables_section,
    ),

    global_variables_section_statement: $ => seq(
      $.global_keyword,
      $.variables_keyword,
    ),

    global_variables_section_body: $ => repeat1($.local_variable_declaration),

    global_var_declaration: $ => seq(
      $.global_keyword,
      $.type,
      alias($.identifier, $.global_variable_name),
    ),

    external_function_prototypes: $ => seq(
      $.external_function_prototypes_statement,
      repeat($.external_function_prototype),
      $.end_function_prototypes_statement,
    ),

    external_function_prototypes_statement: $ => seq(
      $.type_keyword,
      $.prototypes_keyword,
    ),

    external_function_prototype: $ => seq(
      $.function_prototype,
      $.library_keyword,
      alias($.string_literal, $.library_name),
      optional(seq(
        $.alias_keyword,
        $.for_keyword,
        alias($.string_literal, $.alias_name),
      )),
    ),

    instance_variables_section: $ => seq(
      $.instance_variables_section_statement,
      optional($.instance_variables_section_statement_body),
      $.end_variables_section,
    ),

    instance_variables_section_statement: $ => seq(
      $.type_keyword,
      $.variables_keyword,
    ),

    instance_variables_section_statement_body: $ => repeat1(choice(
      $.access_section,
      $.instance_variable_declaration
    )),

    access_section: $ => seq(
      $.access_modifier,
      ":",
    ),

    instance_variable_declaration: $ => seq(
      // optional($.constant_keyword), TODO
      optional($.access_modifier),
      optional($.readacess_modifier),
      optional($.writeaccess_modifier),
      $.local_variable_declaration,
    ),

    readacess_modifier: $ => choice(
      $.protectedread_keyword,
      $.privateread_keyword,
    ),

    writeaccess_modifier: $ => choice(
      $.protectedwrite_keyword,
      $.privatewrite_keyword,
    ),

    event_definition: $ => seq(
      $.event_definition_statement,
      optional(alias($.scriptable_block, $.event_definition_block)),
      $.event_definition_statement_end,
    ),

    event_definition_statement: $ => seq(
      $.event_declaration,
      $.statement_separation,
    ),

    event_definition_statement_end: $ => seq(
      $.end_keyword,
      $.event_keyword,
    ),

    on_event_definition: $ => seq(
      $.on_event_definition_statement,
      optional(alias($.scriptable_block, $.on_event_definition_block)),
      $.on_event_definition_statement_end,
    ),

    on_event_definition_statement: $ => seq(
      $.on_keyword,
      alias($.identifier, $.class_name),
      ".",
      choice($.create_keyword, $.destroy_keyword)
    ),

    on_event_definition_statement_end: $ => seq($.end_keyword, $.on_keyword),

    inner_class_type_definition: $ => seq(
      $.class_type_definition,
      repeat(choice(
        $.event_definition,
        $.on_event_definition,
      )),
    ),

    structure_file: $ => $.structure_definition,

    structure_definition: $ => seq(
      $.structure_definition_statement,
      optional($.structure_definition_body),
      $.end_type_declaration_statement,
    ),

    structure_definition_statement: $ => seq(
      optional($.global_keyword),
      $.type_keyword,
      alias($.identifier, $.structure_name),
      $.from_keyword,
      caseInsensitiveAlias("structure"),
    ),

    structure_definition_body: $ => repeat1($.structure_field),

    structure_field: $ => seq(
      $.type,
      alias($.identifier, $.field_name),
      optional($.array_suffix),
      optional($.structure_field_comment)
    ),

    structure_field_comment: $ => seq(
      $.descriptor_keyword,
      alias($.string_literal, $.descriptor_type),
      "=",
      alias($.string_literal, $.descriptor_value),
    ),

    function_file: $ => seq(
      $.function_type_declaration,
      $.forward_function_prototypes,
      repeat1($.function_definition),
    ),

    function_type_declaration: $ => seq(
      $.function_type_declaration_statement,
      $.end_type_declaration_statement
    ),

    function_type_declaration_statement: $ => seq(
      $.global_keyword,
      $.type_keyword,
      alias($.identifier, $.function_type_name),
      $.from_keyword,
      alias(caseInsensitiveRegExp("function_object"), $.function_type_ancenstor_name),
    ),

    end_type_declaration_statement: $ => seq($.end_keyword, $.type_keyword),

    forward_function_prototypes: $ => seq(
      $.forward_function_prototypes_statement,
      repeat($.function_prototype),
      $.end_function_prototypes_statement,
    ),

    forward_function_prototypes_statement: $ => seq($.forward_keyword, $.prototypes_keyword),

    end_function_prototypes_statement: $ => seq($.end_keyword, $.prototypes_keyword),

    event_declaration: $ => seq(
      $.event_keyword,
      optional(seq($.type_keyword, alias($.type, $.return_type))),
      alias($.identifier, $.event_name),
      optional($.parameter_list),
      optional($.throws_clause),
      optional($.event_id),
    ),

    event_id: $ => /pbm_[a-zA-Z_][a-zA-Z0-9_]*/,

    function_prototype: $ => choice(
      $._function_prototype,
      $._subroutine_prototype,
    ),

    _function_prototype: $ => seq(
      optional($.global_keyword),
      optional($.access_modifier),
      $.function_keyword,
      alias($.type, $.return_type),
      alias($.identifier, $.function_name),
      $.parameter_list,
      optional($.throws_clause),
    ),

    _subroutine_prototype: $ => seq(
      optional($.global_keyword),
      optional($.access_modifier),
      $.subroutine_keyword,
      alias($.identifier, $.subroutine_name),
      $.parameter_list,
      optional($.throws_clause),
    ),

    throws_clause: $ => seq(
      $.throws_keyword,
      commaSep1(alias($.identifier, $.throwable_name)),
    ),

    function_definition: $ => choice(
      $._function_definition,
      $._subroutine_definition,
    ),

    _function_definition: $ => seq(
      $.function_definition_statement,
      optional(alias($.scriptable_block, $.function_definition_block)),
      $.function_definition_statement_end,
    ),

    function_definition_statement: $ => seq($._function_prototype, $.statement_separation),

    function_definition_statement_end: $ => seq($.end_keyword, $.function_keyword),

    _subroutine_definition: $ => seq(
      $.subroutine_definition_statement,
      optional(alias($.scriptable_block, $.subroutine_definition_block)),
      $.subroutine_definition_statement_end,
    ),

    subroutine_definition_statement: $ => seq($._subroutine_prototype, $.statement_separation),

    subroutine_definition_statement_end: $ => seq($.end_keyword, $.subroutine_keyword),

    parameter_list: $ => seq($.open_parenthesis, commaSep($.parameter), $.close_parenthesis),

    parameter: $ => seq(
      optional(alias(choice(
        $.ref_keyword,
        $.readonly_keyword,
      ), $.parameter_pass_by_type)),
      $.type,
      alias($.identifier, $.parameter_name),
      optional($.array_parameter_declaration_suffix),
    ),

    local_variable_declaration: $ => seq(
      optional($.constant_keyword),
      alias($.type, $.variable_type),
      optional($.variable_precision),
      $.variable_declaration_list,
    ),

    variable_precision: $ => seq($.open_curly_brackets, $.integer_literal, $.close_curly_brackets),

    variable_declaration_list: $ => commaSep1($.variable_declaration),

    variable_declaration: $ => seq(
      alias($.identifier, $.variable_name),
      optional($.array_suffix),
      optional(seq("=", alias($.expression, $.initial_value))),
    ),

    array_suffix: $ => seq(
      $.open_brackets,
      choice(
        commaSep($.expression),
        commaSep(seq($.expression, $.to_keyword, $.expression)),
      ),
      $.close_brackets,
    ),

    array_parameter_declaration_suffix: $ => seq($.open_brackets, $.close_brackets),

    access_modifier: $ => choice(
      $.public_keyword,
      $.private_keyword,
      $.protected_keyword,
    ),


    scriptable_block: $ => repeat1($.statement),

    statement: $ => choice(
      $.expression_statement,
    ),

    expression_statement: $ => choice(
      $.update_expression
    ),

    expression: $ => 'expression',

    update_expression: $ => {
      const argument = alias($.integer_literal, $.argument);
      const operator = alias(choice('--', '++'), $.operator);
      return prec.right(PREC.UPDATE_UNARY, seq(argument, operator));
    },

    type: $ => choice(
      $.primitive_type,
      $.identifier,
    ),

    _literal: $ => choice(
      $.integer_literal,
      $.decimal_literal,
      $.real_literal,
      $.string_literal,
      $.date_literal,
      $.time_literal,
      $.boolean_literal,
    ),

    integer_literal: _ => /\d+/,
    decimal_literal: _ => /\d*\.\d+/,
    real_literal: _ => /(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)[Ee][+-]?[0-9]+/,
    date_literal: _ => /(?:\d{4}-\d{2}-\d{2})/,
    time_literal: $ => /(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,6})?/,

    string_literal: $ => choice(
      seq($.double_quote, alias(repeat(token.immediate(prec(1, choice(/[^"\\]/, /\\./, /~"/)))), $.string_content), $.double_quote),
      seq($.single_quote, alias(repeat(token.immediate(prec(1, choice(/[^'\\]/, /\\./, /~'/)))), $.string_content), $.single_quote),
    ),

    boolean_literal: $ => choice(
      $.true_keyword,
      $.false_keyword,
    ),

    primitive_type: _ => choice(
      caseInsensitiveAlias("blob"),
      caseInsensitiveAlias("boolean"),
      caseInsensitiveAlias("byte"),
      caseInsensitiveAlias("char"),
      caseInsensitiveAlias("character"),
      caseInsensitiveAlias("date"),
      caseInsensitiveAlias("datetime"),
      caseInsensitiveAlias("decimal"),
      caseInsensitiveAlias("dec"),
      caseInsensitiveAlias("double"),
      caseInsensitiveAlias("integer"),
      caseInsensitiveAlias("int"),
      caseInsensitiveAlias("longlong"),
      caseInsensitiveAlias("long"),
      caseInsensitiveAlias("real"),
      caseInsensitiveAlias("string"),
      caseInsensitiveAlias("time"),
      caseInsensitiveAlias("unsignedinteger"),
      caseInsensitiveAlias("unsignedint"),
      caseInsensitiveAlias("uint"),
      caseInsensitiveAlias("unsignedlong"),
      caseInsensitiveAlias("ulong"),
      caseInsensitiveAlias("any"),
    ),

    open_parenthesis: _ => "(",
    close_parenthesis: _ => ")",
    open_brackets: _ => "[",
    close_brackets: _ => "]",
    open_curly_brackets: _ => "{",
    close_curly_brackets: _ => "}",
    single_quote: _ => "\'",
    double_quote: _ => "\"",
    statement_separation: _ => ";",

    public_keyword: _ => reservedWord("public"),
    private_keyword: _ => reservedWord("private"),
    protected_keyword: _ => reservedWord("protected"),
    alias_keyword: _ => reservedWord("alias"),
    and_keyword: _ => reservedWord("and"),
    autoinstantiate_keyword: _ => reservedWord("autoinstantiate"),
    call_keyword: _ => reservedWord("call"),
    case_keyword: _ => reservedWord("case"),
    catch_keyword: _ => reservedWord("catch"),
    choose_keyword: _ => reservedWord("choose"),
    close_keyword: _ => reservedWord("close"),
    commit_keyword: _ => reservedWord("commit"),
    connect_keyword: _ => reservedWord("connect"),
    constant_keyword: _ => reservedWord("constant"),
    continue_keyword: _ => reservedWord("continue"),
    create_keyword: _ => reservedWord("create"),
    cursor_keyword: _ => reservedWord("cursor"),
    declare_keyword: _ => reservedWord("declare"),
    delete_keyword: _ => reservedWord("delete"),
    describe_keyword: _ => reservedWord("describe"),
    descriptor_keyword: _ => reservedWord("descriptor"),
    destroy_keyword: _ => reservedWord("destroy"),
    disconnect_keyword: _ => reservedWord("disconnect"),
    do_keyword: _ => reservedWord("do"),
    dynamic_keyword: _ => reservedWord("dynamic"),
    else_keyword: _ => reservedWord("else"),
    elseif_keyword: _ => reservedWord("elseif"),
    end_keyword: _ => reservedWord("end"),
    enumerated_keyword: _ => reservedWord("enumerated"),
    event_keyword: _ => reservedWord("event"),
    execute_keyword: _ => reservedWord("execute"),
    exit_keyword: _ => reservedWord("exit"),
    external_keyword: _ => reservedWord("external"),
    false_keyword: _ => reservedWord("false"),
    fetch_keyword: _ => reservedWord("fetch"),
    finally_keyword: _ => reservedWord("finally"),
    first_keyword: _ => reservedWord("first"),
    for_keyword: _ => reservedWord("for"),
    forward_keyword: _ => reservedWord("forward"),
    from_keyword: _ => reservedWord("from"),
    function_keyword: _ => reservedWord("function"),
    global_keyword: _ => reservedWord("global"),
    goto_keyword: _ => reservedWord("goto"),
    halt_keyword: _ => reservedWord("halt"),
    if_keyword: _ => reservedWord("if"),
    immediate_keyword: _ => reservedWord("immediate"),
    indirect_keyword: _ => reservedWord("indirect"),
    insert_keyword: _ => reservedWord("insert"),
    into_keyword: _ => reservedWord("into"),
    intrinsic_keyword: _ => reservedWord("intrinsic"),
    is_keyword: _ => reservedWord("is"),
    last_keyword: _ => reservedWord("last"),
    library_keyword: _ => reservedWord("library"),
    loop_keyword: _ => reservedWord("loop"),
    native_keyword: _ => reservedWord("native"),
    next_keyword: _ => reservedWord("next"),
    not_keyword: _ => reservedWord("not"),
    of_keyword: _ => reservedWord("of"),
    on_keyword: _ => reservedWord("on"),
    open_keyword: _ => reservedWord("open"),
    or_keyword: _ => reservedWord("or"),
    parent_keyword: _ => reservedWord("parent"),
    post_keyword: _ => reservedWord("post"),
    prepare_keyword: _ => reservedWord("prepare"),
    prior_keyword: _ => reservedWord("prior"),
    privateread_keyword: _ => reservedWord("privateread"),
    privatewrite_keyword: _ => reservedWord("privatewrite"),
    procedure_keyword: _ => reservedWord("procedure"),
    protectedread_keyword: _ => reservedWord("protectedread"),
    protectedwrite_keyword: _ => reservedWord("protectedwrite"),
    prototypes_keyword: _ => reservedWord("prototypes"),
    readonly_keyword: _ => reservedWord("readonly"),
    ref_keyword: _ => reservedWord("ref"),
    return_keyword: _ => reservedWord("return"),
    rollback_keyword: _ => reservedWord("rollback"),
    rpcfunc_keyword: _ => reservedWord("rpcfunc"),
    select_keyword: _ => reservedWord("select"),
    selectblob_keyword: _ => reservedWord("selectblob"),
    shared_keyword: _ => reservedWord("shared"),
    static_keyword: _ => reservedWord("static"),
    step_keyword: _ => reservedWord("step"),
    subroutine_keyword: _ => reservedWord("subroutine"),
    super_keyword: _ => reservedWord("super"),
    system_keyword: _ => reservedWord("system"),
    systemread_keyword: _ => reservedWord("systemread"),
    systemwrite_keyword: _ => reservedWord("systemwrite"),
    then_keyword: _ => reservedWord("then"),
    this_keyword: _ => reservedWord("this"),
    throw_keyword: _ => reservedWord("throw"),
    throws_keyword: _ => reservedWord("throws"),
    to_keyword: _ => reservedWord("to"),
    trigger_keyword: _ => reservedWord("trigger"),
    true_keyword: _ => reservedWord("true"),
    try_keyword: _ => reservedWord("try"),
    type_keyword: _ => reservedWord("type"),
    until_keyword: _ => reservedWord("until"),
    update_keyword: _ => reservedWord("update"),
    updateblob_keyword: _ => reservedWord("updateblob"),
    using_keyword: _ => reservedWord("using"),
    variables_keyword: _ => reservedWord("variables"),
    while_keyword: _ => reservedWord("while"),
    with_keyword: _ => reservedWord("with"),
    within_keyword: _ => reservedWord("within"),
    debug_keyword: _ => reservedWord("_debug"),
    where_keyword: _ => reservedWord("where"),
    current_keyword: _ => reservedWord("current"),

    export_header: $ => seq(
      $.export_header_identifier,
      optional($.export_header_comments),
    ),

    export_header_identifier: $ => seq(
      "\$PBExportHeader\$",
      $.export_header_identifier_content,
    ),

    export_header_identifier_content: $ => seq(alias($.identifier, $.file_name), ".", $.file_extension),

    export_header_comments: $ => seq(
      "\$PBExportComments\$",
      alias(/[^\r\n]*/, $.export_header_comments_content),
    ),

    file_extension: $ => choice(
      alias("sra", $.application_file_extension),
      alias("sru", $.user_object_file_extension),
      alias("srw", $.window_file_extension),
      alias("srm", $.menu_file_extension),
      alias("srs", $.structure_file_extension),
      alias("srf", $.function_file_extension),
    ),

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9\-_$#%]*/,

    line_comment: _ => seq("//", token.immediate(prec(1, /.*/))),
    block_comment: _ => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
    line_continuation: _ => "&",

  },
});

/**
 * Creates a reserved word
 *
 * @param {string} word
 *
 * @returns {AliasRule}
 */
function reservedWord(word) {
  return alias(reserved(caseInsensitiveRegExp(word)), word)
}

/**
 * Creates a reserved word regex
 *
 * @param {RegExp} regex
 *
 * @returns {TokenRule}
 */
function reserved(regex) {
  return token(prec(1, regex))
}

/**
 * Creates a case insensitive word
 *
 * @param {string} word
 *
 * @returns {RegExp}
 */
function caseInsensitiveRegExp(word) {
  return new RegExp(word.split("")
    .map(letter => `[${letter}${letter.toUpperCase()}]`)
    .join("")
  )
}

/**
 * Creates a case insensitive alias rule
 *
 * @param {string} word
 *
 * @returns {AliasRule}
 */
function caseInsensitiveAlias(word) {
  return alias(caseInsensitiveRegExp(word), word)
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
  return seq(rule, repeat(seq(",", rule)));
}
