import PySimpleGUI as sg


class Layout:
    def __getBotControl() -> any:
        """Botのコントロール画面のレイアウトを取得"""
        return [
            [sg.HorizontalSeparator()],
            [sg.Button("Bot起動", key="bootup"), sg.Button("Bot停止", key="shutdown")],
        ]

    def getLayout() -> any:
        """GUIレイアウト"""
        return [
            [
                sg.TabGroup(
                    [
                        [
                            sg.Tab("Botコントロール", Layout.__getBotControl()),
                            sg.Tab("Botコントロール2", Layout.__getBotControl()),
                        ]
                    ]
                )
            ]
        ]
