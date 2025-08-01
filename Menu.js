mw.loader.using(['oojs-ui-core', 'oojs-ui-widgets', 'oojs-ui.styles.icons-content', 'oojs-ui.styles.icons-alerts', 'oojs-ui.styles.icons-interactions', 'oojs-ui.styles.icons-moderation', 'oojs-ui.styles.icons-editing-core', 'oojs-ui.styles.icons-editing-list', 'oojs-ui.styles.icons-editing-functions', 'oojs-ui.styles.icons-editing-advanced', 'oojs-ui.styles.icons-user', 'oojs-ui.styles.icons-layout', 'oojs-ui.styles.icons-accessibility'], function() {
	class ContextMenu {
		static SelectWidget = class extends OO.ui.MenuSelectWidget {
			constructor(config) {
				ContextMenuSelectWidget.super.call(this, config);
				this.depth = 0;
			}
			OnDocumentKeyDown(e) {
				if (ContextMenu.menuList[ContextMenu.menuList.length - 1] != this) return;
				const currentItem = this.findHighlightedItem() || this.findFirstSelectedItem();
				if (currentItem && currentItem.submenu) {
					if (e.keyCode == OO.ui.keys.RIGHT) {
						// navigate into the submenu
						this.chooseItem(currentItem);
					} else if (e.keyCode == OO.ui.keys.LEFT && this != menuList[0]) {
						// navigate back to the parent menu
						ContextMenu.menuList.pop();
						let option = ContextMenu.optionList.pop();
						ContextMenu.menuList[ContextMenu.menuList.length - 1].highlightItem(option);
					}
				}
				switch (e.keyCode) {
					case OO.ui.keys.LEFT:
					case OO.ui.keys.RIGHT:
					case OO.ui.keys.HOME:
					case OO.ui.keys.END:
						e.preventDefault();
					default:
						ContextMenuSelectWidget.super.prototype.onDocumentKeyDown.call(this, e);
				}
			}
			chooseItem(item) {
				if (!item.submenu) {
					ContextMenu.menuList.push(currentItem.submenu);
					ContextMenu.optionList.push(currentItem);
				}
				ContextMenuSelectWidget.super.prototype.chooseItem.call(this, item);
			}
		}
		static OptionWidget = class extends OO.ui.MenuOptionWidget {
			constructor(config, submenu) {
				this.submenu = submenu ? submenu : null;
				if (this.submenu && !config.indicator) {
					config.indicator = 'caret';
				}
				ContextMenuOptionWidget.super.call(this, config);
			}
		}
		static menuList = [];
		static optionList = [];
		static instantiateContextMenu = function( menu ) {
			menuList.push( menu );
			menu.toggle( true );
		}
	}
	OO.inheritClass(ContextMenu.SelectWidget, OO.ui.MenuSelectWidget);
	OO.inheritClass(ContextMenu.OptionWidget, OO.ui.MenuOptionWidget);

	// class Menu {
	// 	static contextMenu = null;
	// 	static instantiateContextMenu = function() {
	// 		if (Menu.contextMenu) {
	// 			Menu.contextMenu.destroy();
	// 		}
	// 		Menu.contextMenu = new Menu();
	// 	}
	// 	static Item = class {
	// 		constructor(label, icon, selectBehavior = function() {}, disabled = false, flags = []) {
	// 			this.option = new OO.ui.MenuOptionWidget({
	// 				label: label,
	// 				icon: icon,
	// 				disabled: disabled,
	// 				flags: flags
	// 			});
	// 			this.selectBehavior = selectBehavior;
	// 		}
	// 	}
	// 	static MenuSectionTitle = class extends Item {
	// 		constructor(label) {
	// 			this.option = new OO.ui.MenuSectionOptionWidget({
	// 				label: label
	// 			});
	// 			this.selectBehavior = function() {};
	// 		}
	// 	}
	// 	constructor(parentMenu, attachedItem, depth = 0) {
	// 		this.parentMenu = parentMenu ? parentMenu : null;
	// 		this.attachedItem = attachedItem ? attachedItem : null;
	// 		this.$container = $('<div/>').css({ position: 'absolute', zIndex: 10000 + depth });
	// 		this.select = OO.ui.MenuSelectWidget();
	// 		this.$container.append(this.select.$element);
	// 		this.items = [];
	// 		this.selectBehaviors = {};
	// 		this.highlightBehaviors = {};
	// 		this.select.on('choose', function(item, selected) {
	// 			if (selected) {
	// 				this.selectBehaviors[item.getData()]();
	// 			}
	// 		}, this);
	// 		this.select.on('highlight', function(item, selected) {
	// 			if (selected) {
	// 				this.selectBehaviors[item.getData()]();
	// 			}
	// 		}, this);
	// 	}
	// 	addItems(arraylist, position = this.items.length) {
	// 		arraylist.forEach(function(item) {
	// 			if (position < this.items.length) {
	// 				this.items.splice(position, 0, item);
	// 				position++;
	// 			} else {
	// 				this.items.push(item);
	// 			}
	// 		});
	// 	}
	// 	populateMenu() {
	// 		this.select.clearItems();
	// 		this.items.forEach(function(item) {
	// 			if (item instanceof Menu.Item) {
	// 				this.select.addItems([item.option]);
	// 				this.selectBehaviors[item.option.getData()] = function() {
	// 					this.select.toggle(false);
	// 					item.selectBehavior();
	// 				}
	// 			} else if (item instanceof Menu) {
	// 				this.select.addItems([item.attachedItem.option]);
	// 				this.selectBehaviors[item.attachedItem.option.getData()] = function() {
						
	// 				}
					
	// 			} else {
	// 				console.error("Invalid item type in menu: " + item);
	// 			}
	// 		}, this);
	// 	}
	// 	show(x, y) {
	// 		this.select.toggle(true);
	// 		this.select.toggleClipping(false);
	// 		let puRect = this.select.$element[0].getBoundingClientRect();
	// 		let width = Math.max(window.innerWidth, document.documentElement.clientWidth);
	// 		let height = Math.max(window.innerHeight, document.documentElement.clientHeight);
	// 		if (puRect.width >= width / 2) {
	// 			select.addItems([
	// 				new OptWidget({ data: "close", label: "Close menu", icon: "close" })
	// 			], 0);
	// 		}
	// 		if (puRect.bottom > height) {
	// 			this.$container.css({ top: $(window).scrollTop() + (height - puRect.height > 3 ? window.innerHeight - puRect.height : 3) });
	// 		}
	// 		puRect = this.select.$element[0].getBoundingClientRect();
	// 		if (puRect.top < 3) {
	// 			this.$container.css({ top: $(window).scrollTop() + 3 });
	// 		}
	// 		puRect = this.select.$element[0].getBoundingClientRect();
	// 		if (puRect.right > width) {
	// 			this.$container.css({ left: contextMenuEvent.pageX - puRect.width - 1 });
	// 		}
	// 		puRect = this.select.$element[0].getBoundingClientRect();
	// 		if (puRect.left < 3) {
	// 			this.$container.css({ left: $(window).scrollLeft() + 3 });
	// 		}
	// 		this.select.toggleClipping(true);
	// 		this.select.toggle(false);
	// 		this.select.toggle(true);
	// 	}
	// 	destroy() {
	// 		this.select.clearItems();
	// 		this.select.$element.remove();
	// 		this.menu.$menu.remove();
	// 		this.select.$element.remove();
	// 		this.$container.remove();
	// 		items = [];
	// 	}
	// }
})