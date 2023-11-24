import PySimpleGUI as sg


class GUIData:
    _window: sg.Window
    _event: str
    _values: str

    def __init__(self) -> None:
        pass

    def windowRead(self) -> None:
        """ウィンドウからイベントや値を取得する"""
        self._event, self._values = self._window.read()
        return

    def closeWindow(self) -> None:
        """ウィンドウを閉じる"""
        self._window.close()
        return

    def setWindowData(self, window: sg.Window) -> None:
        """ウィンドウ情報をセットする"""
        self._window = window
        return

    def getWindowData(self) -> sg.Window:
        """
        ウィンドウ情報を取得する

        Returns:
            sg.Window: ウィンドウ情報
        """
        return self._window

    def getWindowElem(self, target: str = ""):
        """
        ウィンドウの要素を取得する

        Args:
            target (str) : 取得対象 (任意)

        Returns:
            ウィンドウの要素
        """
        return self._window[target]

    def getEvent(self) -> str:
        """
        イベント情報を取得する

        Returns:
            str: イベント情報
        """
        return self._event

    def getValue(self, target: str) -> str:
        """
        要素の値を取得する

        Args:
            target (str) : 取得対象

        Returns:
            str: 要素の値
        """
        return self._values[target]
