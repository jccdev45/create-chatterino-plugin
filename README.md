# Create Chatterino Plugin

A CLI tool to quickly generate the basic structure for a Chatterino plugin. Chatterino plugins were introduced in v2.5.2, you can read more about them in the [Chatterino changelog](https://chatterino.com/changelog#2.5.2-plugins) or in more detail at the [plugin documentation](https://github.com/Chatterino/chatterino2/blob/master/docs/wip-plugins.md).

## Features

* Interactive prompts for plugin name and permissions.
* Generates `info.json` and `init.lua` files with basic content.
* Creates the plugin directory in the appropriate location based on the operating system:
  * Windows: %APPDATA%/Chatterino2
  * Linux: $HOME/.local/share/chatterino
  * Mac: $HOME/Library/Application Support/chatterino

## Usage

```sh
bunx chatterino-plugin [pluginName]
# or
npmx chatterino-plugin [pluginName]
```

If you don't provide a plugin name as an argument, the tool will prompt you for it.

You can also specify permissions using the `--permissions` flag (optional):

```sh
bunx chatterino-plugin my-cool-plugin --permissions FilesystemRead,HTTP
```

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

## License

MIT
