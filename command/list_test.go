package command

import (
	"testing"

	"github.com/hashicorp/vault/http"
	"github.com/hashicorp/vault/vault"
	"github.com/mitchellh/cli"
)

func TestList(t *testing.T) {
	core, _, token := vault.TestCoreUnsealed(t)
	ln, addr := http.TestServer(t, core)
	defer ln.Close()

	ui := new(cli.MockUi)
	c := &ListCommand{
		Meta: Meta{
			ClientToken: token,
			Ui:          ui,
		},
	}

	// Write data
	args := []string{
		"-address", addr,
		"secret/",
	}

	// Run once so the client is setup, ignore errors
	c.Run(args)

	// Get the client so we can write data
	client, err := c.Client()
	if err != nil {
		t.Fatalf("err: %s", err)
	}

	data := map[string]interface{}{"value": "bar"}
	if _, err := client.Logical().Write("secret/foo", data); err != nil {
		t.Fatalf("err: %s", err)
	}

	// Run the read
	if code := c.Run(args); code != 0 {
		t.Fatalf("bad: %d\n\n%q", code, ui.ErrorWriter.String())
	}

	output := ui.OutputWriter.String()
	if output != "foo\n" {
		t.Fatalf("unexpected output:\n%q", output)
	}
}

func TestList_notFound(t *testing.T) {
	core, _, token := vault.TestCoreUnsealed(t)
	ln, addr := http.TestServer(t, core)
	defer ln.Close()

	ui := new(cli.MockUi)
	c := &ListCommand{
		Meta: Meta{
			ClientToken: token,
			Ui:          ui,
		},
	}

	args := []string{
		"-address", addr,
		"secree/nope/",
	}
	if code := c.Run(args); code != 1 {
		t.Fatalf("bad: %d\n\n%q", code, ui.ErrorWriter.String())
	}
}

func TestList_empty(t *testing.T) {
	core, _, token := vault.TestCoreUnsealed(t)
	ln, addr := http.TestServer(t, core)
	defer ln.Close()

	ui := new(cli.MockUi)
	c := &ListCommand{
		Meta: Meta{
			ClientToken: token,
			Ui:          ui,
		},
	}

	args := []string{
		"-address", addr,
		"secret/nope/",
	}

	if code := c.Run(args); code != 0 {
		t.Fatalf("bad: %d\n\n%q", code, ui.ErrorWriter.String())
	}

	if ui.OutputWriter != nil {
		t.Fatalf("unexpected output:\n%q", ui.OutputWriter.String())
	}
}

func TestList_notDir(t *testing.T) {
	core, _, token := vault.TestCoreUnsealed(t)
	ln, addr := http.TestServer(t, core)
	defer ln.Close()

	ui := new(cli.MockUi)
	c := &ListCommand{
		Meta: Meta{
			ClientToken: token,
			Ui:          ui,
		},
	}

	// Write data
	args := []string{
		"-address", addr,
		"secret/foo",
	}

	// Run once so the client is setup, ignore errors
	c.Run(args)

	// Get the client so we can write data
	client, err := c.Client()
	if err != nil {
		t.Fatalf("err: %s", err)
	}

	data := map[string]interface{}{"value": "baz"}
	if _, err := client.Logical().Write("secret/foo/bar", data); err != nil {
		t.Fatalf("err: %s", err)
	}
	if _, err := client.Logical().Write("secret/foo/foo", data); err != nil {
		t.Fatalf("err: %s", err)
	}

	// Run the read
	if code := c.Run(args); code != 0 {
		t.Fatalf("bad: %d\n\n%q", code, ui.ErrorWriter.String())
	}

	output := ui.OutputWriter.String()
	if output != "bar\nfoo\n" {
		t.Fatalf("unexpected output:\n%q", output)
	}
}
