import XCTest
import SwiftTreeSitter
import TreeSitterPowerbuilder

final class TreeSitterPowerbuilderTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_powerbuilder())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Powerbuilder grammar")
    }
}
