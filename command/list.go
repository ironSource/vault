package command

import (
	"fmt"
	"strings"
)

// ListCommand is a Command that lists keys from the Vault.
type ListCommand struct {
	Meta
}

func (c *ListCommand) Run(args []string) int {
	var format string
	field := "keys"
	flags := c.Meta.FlagSet("list", FlagSetDefault)
	flags.StringVar(&format, "format", "table", "")
	flags.Usage = func() { c.Ui.Error(c.Help()) }
	if err := flags.Parse(args); err != nil {
		return 1
	}

	args = flags.Args()
	if len(args) != 1 {
		c.Ui.Error("list expects one argument")
		flags.Usage()
		return 1
	}

	path := args[0]
	if path[0] == '/' {
		path = path[1:]
	}

	if !strings.HasSuffix(path, "/") {
		path += "/"
	}

	client, err := c.Client()
	if err != nil {
		c.Ui.Error(fmt.Sprintf(
			"Error initializing client: %s", err))
		return 2
	}

	secret, err := client.Logical().Read(path)
	if err != nil {
		c.Ui.Error(fmt.Sprintf(
			"Error listing %s: %s", path, err))
		return 1
	}
	if secret == nil {
		c.Ui.Error(fmt.Sprintf(
			"No value found at %s", path))
		return 1
	}

	// Handle single field output
	if val, ok := secret.Data[field]; ok {
		if format == "table" {
			if val != nil {
				for _, v := range val.([]interface{}) {
					c.Ui.Output(v.(string))
				}
			}
			return 0
		} else {
			return OutputSecret(c.Ui, format, secret)
		}
	} else {
		c.Ui.Error(fmt.Sprintf(
			"Field %s not present in secret", field))
		return 1
	}
}

func (c *ListCommand) Synopsis() string {
	return "List data or secrets from Vault"
}

func (c *ListCommand) Help() string {
	helpText := `
Usage: vault list [options] path

  List data from Vault.

  List reads data at the given path from Vault and returns a list of keys
  present under this path inside vault.  Please reference the documentation
  for the backends in use to determine key structure.

General Options:

  ` + generalOptionsUsage() + `

Read Options:

  -format=table           The format for output. By default it is a whitespace-
                          delimited table. This can also be json or yaml.

`
	return strings.TrimSpace(helpText)
}
