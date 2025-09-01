package tree_sitter_powerbuilder_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_powerbuilder "github.com/tree-sitter/tree-sitter-powerbuilder/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_powerbuilder.Language())
	if language == nil {
		t.Errorf("Error loading Powerbuilder grammar")
	}
}
