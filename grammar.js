/* eslint-disable object-curly-spacing */
/**
 * @file Powerbuilder grammar for tree-sitter
 * @author Jose Cagnini
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check



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
        $.function_file
      ),
    ),

    function_file: $ => seq(
      $.class_type_declaration,
      $.forward_function_prototypes,
      repeat1($.function_definition),
    ),

    class_type_declaration: $ => seq(
      $.class_type_declaration_statement,
      optional($.class_type_declaration_statement_body),
      $.class_type_declaration_statement_end
    ),

    class_type_declaration_statement: $ => seq(
      optional($.global_keyword),
      $.type_keyword,
      alias($.identifier, $.class_type_name),
      $.from_keyword,
      alias($.identifier, $.class_type_ancenstor_name),
      optional($.autoinstantiate_keyword),
      optional(seq(
        $.within_keyword,
        alias($.identifier, $.class_type_parent_class_name),
        optional(seq(
          $.descriptor_keyword,
          alias($.string_literal, $.descriptor_type),
          "=",
          alias($.string_literal, $.descriptor_value),
        )),
      )),
    ),

    class_type_declaration_statement_body: $ => '123',

    class_type_declaration_statement_end: $ => seq($.end_keyword, $.type_keyword),

    forward_function_prototypes: $ => seq(
      $.forward_function_prototypes_statement,
      repeat1($.function_prototype),
      $.forward_function_prototypes_statement_end,
    ),

    forward_function_prototypes_statement: $ => seq($.forward_keyword, $.prototypes_keyword),

    forward_function_prototypes_statement_end: $ => seq($.end_keyword, $.prototypes_keyword),

    function_prototype: $ => choice(
      $._function_prototype,
      $._subroutine_prototype,
    ),

    _function_prototype: $ => seq(
      optional($.global_keyword),
      optional($.access_modifier),
      $.function_keyword,
      $.types,
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
      commaSep1($.identifier),
    ),

    function_definition: $ => choice(
      $._function_definition,
      $._subroutine_definition,
    ),

    _function_definition: $ => seq(
      alias(seq($._function_prototype, $.statement_separation), $.function_definition_statement),
      alias($.scriptable_block, $.function_definition_block),
      alias(seq($.end_keyword, $.function_keyword), $.function_definition_statement_end),
    ),

    _subroutine_definition: $ => seq(
      alias(seq($._subroutine_prototype, $.statement_separation), $.subroutine_definition_statement),
      alias($.scriptable_block, $.subroutine_definition_block),
      alias(seq($.end_keyword, $.subroutine_keyword), $.subroutine_definition_statement_end),
    ),

    parameter_list: $ => seq($.open_parenthesis, commaSep($.parameter), $.close_parenthesis),

    parameter: $ => seq(
      optional(alias(choice(
        $.ref_keyword,
        $.readonly_keyword,
      ), $.parameter_pass_by_type)),
      $.types,
      alias($.identifier, $.parameter_name),
      optional($.array_declaration_suffix),
    ),

    array_declaration_suffix: $ => seq($.open_brackets, $.close_brackets),

    scriptable_block: $ => "123",

    access_modifier: $ => choice(
      $.public_keyword,
      $.private_keyword,
      $.protected_keyword,
    ),

    types: $ => choice(
      $.primitive_types,
      $.identifier,
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

    primitive_types: _ => choice(
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
      alias("srw", $.window_file_extension),
      alias("sru", $.user_object_file_extension),
      alias("srd", $.datawindow_file_extension),
      alias("srs", $.structure_file_extension),
      alias("srf", $.function_file_extension),
      alias("srm", $.menu_file_extension),
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
