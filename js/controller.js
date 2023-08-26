const controller = (function (modelController, viewController) {
    const setupEventListeners = function () {
        const DOM = viewController.getDomStrings();
        document
            .querySelector(DOM.form)
            .addEventListener("submit", ctrlAddItem);

        // Клик по таблице с доходами и расходами
        document
            .querySelector(DOM.budgetTable)
            .addEventListener("click", ctrlDeleteItem);
    };

    // Обновляем проценты у каждой записи
    function updatePercentages() {

        // 1. Посчитать проценты для каждой записи типа Expense
        modelController.calculatePercentages();
        modelController.test();

        // 2. Получаем данные по процентам с модели
        const idsAndPercents = modelController.getAllIdsAndPercentages();

        // 3. Обновить UI с новыми процентами
        viewController.updateItemsPercentages(idsAndPercents);
    }

    // Функция, срабатывающая при отправке формы
    function ctrlAddItem(event) {
        event.preventDefault();

        // 1. Получить данные из формы
        const input = viewController.getInput();

        // Проверка что поля не пустые
        if (
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Добавить полученные данные в модель
            const newItem = modelController.addItem(
                input.type,
                input.description,
                input.value
            );
            modelController.test();

            // 3. Добавить "запись" в UI
            viewController.renderListItem(newItem, input.type);
            viewController.clearFields();
            generateTestData.init();

            // 4. Посчитать бюджет
            updateBudget();

            // 5. Пересчитали проценты
            updatePercentages();
        } // endIf
    }

    function ctrlDeleteItem(event) {

        if (event.target.closest(".item__remove")) {
            // Находим ID записи, которую надо удалить
            const itemID = event.target.closest("li.budget-list__item").id; // inc-0
            const splitID = itemID.split("-"); // "inc-0" => ["inc", "0"]
            const type = splitID[0];
            const ID = parseInt(splitID[1]);

            // Удаляем запись из модели
            modelController.deleteItem(type, ID);

            // Удаляем запись из шаблона
            viewController.deleteListItem(itemID);

            // Посчитать бюджет
            updateBudget();

            // Пересчитали проценты
            updatePercentages();
        }
    }

    function updateBudget() {
        // 1. Рассчитать бюджет в модели
        modelController.calculateBudget();

        // 2. Получить рассчитанный бюджет из модели
        budgetObj = modelController.getBudget();

        // 3. Отобразить бюджет в Шаблоне
        viewController.updateBudget(budgetObj);
    }

    return {
        init: function () {
            console.log("App started!");
            viewController.displayMonth();
            setupEventListeners();
            viewController.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
        },
    };
})(modelController, viewController);

controller.init();
